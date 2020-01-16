sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"palina/maiseyenka/model/customNameType",
	"palina/maiseyenka/model/customEmailType"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("palina.maiseyenka.controller.UserDetails", {

		_oMessageManager: sap.ui.getCore().getMessageManager(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			var oView = this.oView;

			var oRouter = this.getRouter();
			oRouter.getRoute("userDetails").attachPatternMatched(this._onObjectMatched, this);

			//model for edited user info
			var oEditedUserModel = new JSONModel();
			oEditedUserModel.setData({
				"EditedUser": {}
			});
			this.setModel(oEditedUserModel, "editedUser");

			//model for form validation messages
			this.setModel(this._oMessageManager.getMessageModel(), "message");
			this._oMessageManager.registerObject(oView.byId("userDetailsEdit"), true);
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
		onNavBtnPress: function () {
			this.onNavBack();
			this._resetFormChanges();
			this._changeFragmentForEditing(false);
			this._oMessageManager.removeAllMessages();
		},

        /**
		 * Event handler for edit button press.
		 * Changes form fragment to editing and hides Salary chart.
		 * Saves initial data of edited user.
		 * @public
		 */
		onEditBtnPress() {
			this._changeFragmentForEditing(true);
			this._showSalaryChart(false);
			this._createEditableUserData();
		},

		/**
		 * Event handler for save button press.
		 * Changes form fragment to displaying and shows Salary chart.
		 * Updates model with edited user.
		 * @public
		 */
		onSaveBtnPress() {
			this._changeFragmentForEditing(false);
			this._showSalaryChart(true);
		},

		/**
		 * Event handler for form input change.
		 * Validates form inputs and hides save button if form is not valid.
		 * @public
		 */
		onInputChange: function () {
			var oMessages = this.oView.getModel("message").getData();
			this.enableBtn("saveBtn", !oMessages.length);
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
			this.oView.bindElement({
				path: "/UsersData/" + oEvent.getParameter("arguments").index,
				model: "usersData"
			});
			this._showSalaryChart(true);
		},

		/**
		 * Toggles Salary chart visibility depending on bIsShown param.
		 * If there is no salary data in model displays noSalaryData text.
		 * @function
		 * @param {boolean} bIsShown means whether to display Salary chart or not.
		 * @private
		 */
		_showSalaryChart(bIsShown) {
			if (!bIsShown) {
				this.showFragment("SalaryChart", false);
				this.showFragment("noSalaryDataText", false);
				return;
			}
			var aSalariesData = this.oView.getBindingContext("usersData").getObject().salariesData;

			if (aSalariesData) {
				this.showFragment("SalaryChart", true);
				this.showFragment("noSalaryDataText", false);
			} else {
				this.showFragment("SalaryChart", false);
				this.showFragment("noSalaryDataText", true);
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
		_changeFragmentForEditing: function (bEdit) {
			this._showFormFragment(bEdit ? "userDetailsEdit" : "userDetailsDisplay");
		},

		/**
		 * Shows fragment depending on name.
		 * Shows selected fragment and hides other fragments.
		 * @function
		 * @param {string} sFragmentName means which fragment to display
		 * @private
		 */
		_showFormFragment: function (sFragmentName) {
			this.showFragment(sFragmentName, true);
			var aFragments = this.getModel("appView").getProperty("/fragments");
			var aFragmentsToHide = aFragments.filter(function (sFragmentToHide) {
				return sFragmentToHide != sFragmentName;
			});
			aFragmentsToHide.forEach(function(sFragmentToHide) {
				this.showFragment(sFragmentToHide, false);
			}.bind(this));
			this._setActiveFragmentToModel(sFragmentName);
		},

		/**
		 * Sets active fragment name into model property activeFragment.
		 * @param {String} sFragmentName name of active fragment. 
		 * @function
		 * @private
		 */
		_setActiveFragmentToModel: function (sFragmentName) {
			this.getModel("appView").setProperty("/activeFragment", sFragmentName);
		},

		/**
		 * Gets edited user initial data and pushes it into editedUser model.
		 * @function
		 * @private
		 */
		_createEditableUserData: function () {
			var oModel = this.getModel("editedUser");
			var oEditedUser = jQuery.extend(true, {}, this.oView.getBindingContext("usersData").getObject());
			oModel.setProperty("/EditedUser", oEditedUser);
		},

        /**
		 * Resets form changes.
		 * Gets data from editedUser model property and adds it into usersData.
		 * @function
		 * @private
		 */
		_resetFormChanges: function () {
			var sActiveFragment = this.getModel("appView").getProperty("/activeFragment");
			//resets form only if active fragment is for editing
			if (sActiveFragment !== "userDetailsEdit") {
				return;
			}
			//gets edited user initial data from editedUser model
			var oNewUser = this.getModel("editedUser").getProperty("/EditedUser");
			var oPath = this.oView.getBindingContext("usersData").getPath();
			var oModel = this.getModel("usersData");
			oModel.setProperty(oPath, oNewUser);
		}
	});
});