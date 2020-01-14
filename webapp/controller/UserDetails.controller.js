sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/BindingMode"
], function (Controller, History, JSONModel, BindingMode) {
	"use strict";

	return Controller.extend("palina.maiseyenka.controller.UserDetails", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			var oView = this.getView();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("userDetails").attachPatternMatched(this._onObjectMatched, this);
			
			//model for fragments names
			var oFragmentsModel = new JSONModel();
			oFragmentsModel.setData({
				"fragments": [
					"userDetailsEdit",
					"userDetailsDisplay"
				],
				"activeFragment": ""
			});            
			oView.setModel(oFragmentsModel, "formFragments");

			//model for edited user info
			var oEditedUserModel = new JSONModel();
			oEditedUserModel.setData({
				"EditedUser": {}
			});
			oEditedUserModel.setDefaultBindingMode(BindingMode.OneWay);
			oView.setModel(oEditedUserModel, "editedUser");

			//model for form validation messages
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oView.setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(oView.byId("userDetailsEdit"), true);

			this._showFormFragment("userDetailsDisplay");
		},

		onExit: function () {			
			this.getView().getBindingContext("usersData").destroy();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */		

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("usersList", true);
			}
			this._resetFormChanges();
			this._toggleButtonsAndView(false);
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

        /**
		 * Event handler for edit button press.
		 * Changes form fragment to editing and hides Salary chart.
		 * Saves initial data of edited user.
		 * @public
		 */
		onEditBtnPress() {
			this._toggleButtonsAndView(true);
			this._showSalaryChart(false);
			this._saveEditedUserData();
		},

		/**
		 * Event handler for save button press.
		 * Changes form fragment to displaying and shows Salary chart.
		 * Updates model with edited user.
		 * @public
		 */
		onSaveBtnPress() {
			this._toggleButtonsAndView(false);
			this._showSalaryChart(true);
		},

		/**
		 * Event handler for form input change.
		 * Validates form inputs and hides save button if form is not valid.
		 * @public
		 */
		onInputChange: function (oEvent) {
			var oView = this.getView();
			var sValue = oEvent.getParameter("value");
			var oInput = oEvent.getSource();
			var oMessages = oView.getModel("message").getData();
			if (oMessages.length !== 0) {
				oView.byId("saveBtn").setEnabled(false);
				return;
			} else {
				oView.byId("saveBtn").setEnabled(true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			this.getView().bindElement({
				path: "/UsersData/" + oEvent.getParameter("arguments").index,
				model: "usersData"
			});
			this._showSalaryChart(true);
		},

		/**
		 * Toggles Salary chart visibility depending on bIsShown param.
		 * If there is no salary data in model displays noSalaryData text.
		 * @function
		 * @param {boolean} bIsShown means whether to display Salary chart or not
		 * @private
		 */
		_showSalaryChart(bIsShown) {
			if(!bIsShown) {
				this.getView().byId("noSalaryDataText").setVisible(false);
				this.getView().byId("salaryChart").setVisible(false);
				return;
			}
			var aSalariesData = this.getView().getBindingContext("usersData").getObject().salariesData;
		
			if(aSalariesData) {
				this.getView().byId("noSalaryDataText").setVisible(false);
				this.getView().byId("salaryChart").setVisible(true);
			} else {
				this.getView().byId("noSalaryDataText").setVisible(true);
				this.getView().byId("salaryChart").setVisible(false);
			}
		},

		/**
		 * Toggles form fragment depending on bEdit param.
		 * If bEdit is true shows fragment for editing.
		 * If bEdit is false shows fragment for displaying.
		 * @function
		 * @param {boolean} bEdit means whether to display fragment for editing or for displaying
		 * @private
		 */
		_toggleButtonsAndView: function (bEdit) {
			var oView = this.getView();
			if (bEdit) {
				oView.byId("saveBtn").setVisible(true);
			} else {
				oView.byId("saveBtn").setVisible(false);
			}
			this._showFormFragment(bEdit ? "userDetailsEdit" : "userDetailsDisplay");			
		},

		/**
		 * Shows fragment depending on name.
		 * Shows selected fragment and hides other fragments.
		 * @function
		 * @param {String} sFragmentName means which fragment to display
		 * @private
		 */
		_showFormFragment: function (sFragmentName) {
			var oView = this.getView();
			oView.byId(sFragmentName).setVisible(true);
			var aFragments = this.getView().getModel("formFragments").getProperty("/fragments");
			var fragmentsToHide = aFragments.filter(fragment => fragment != sFragmentName);
			fragmentsToHide.forEach(fragment => this._hideFormFragment(fragment));
			this._setActiveFragmentToModel(sFragmentName);
		},

        /**
		 * Hides fragment depending on name.
		 * @function
		 * @param {String} sFragmentName means which fragment to hide
		 * @private
		 */
		_hideFormFragment: function (sFragmentName) {
			this.getView().byId(sFragmentName).setVisible(false);
		},

		/**
		 * Gets edited user initial data and pushes it into editedUser model.
		 * @function
		 * @private
		 */
		_saveEditedUserData: function () {
			var oModel = this.getView().getModel("editedUser");
			var oEditedUser = jQuery.extend(true, {}, this.getView().getBindingContext("usersData").getObject());
			oModel.setProperty("/EditedUser", oEditedUser);
		},

        /**
		 * Resets form changes.
		 * Gets data from editedUser model property and adds it into usersData.
		 * @function
		 * @private
		 */
		_resetFormChanges: function () {
			var sActiveFragment = this.getView().getModel("formFragments").getProperty("/activeFragment");
		    //resets form only if active fragment is for editing
			if(sActiveFragment !== "userDetailsEdit") {
				return;
			}
			//gets edited user initial data from editedUser model
			var oNewUser = this.getView().getModel("editedUser").getProperty("/EditedUser");
			var oBinding = this.getView().getBindingContext("usersData").getPath();
			var index = oBinding.split("/")[2];
			var oModel = this.getView().getModel("usersData");
			var aItems = oModel.getProperty("/UsersData");
			aItems[index] = oNewUser;
			oModel.setProperty("/UsersData", aItems);
		},

		/**
		 * Sets active fragment name into model property activeFragment.
		 * @param {String} sFragmentName name of active fragment. 
		 * @function
		 * @private
		 */
		_setActiveFragmentToModel: function (sFragmentName) {
			this.getView().getModel("formFragments").setProperty("/activeFragment", sFragmentName);
		}
	});
});