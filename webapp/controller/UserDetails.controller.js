sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Context"
], function (Controller, History, JSONModel, Context) {
	"use strict";

	return Controller.extend("palina.maiseyenka.controller.UserDetails", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("userDetails").attachPatternMatched(this._onObjectMatched, this);

			var oModel = new JSONModel();
			oModel.setData({
				"fragments": [
					"userDetailsEdit",
					"userDetailsDisplay"
				]
			});

			this.getView().setModel(oModel, "formFragments");
			this._showFormFragment("userDetailsDisplay");
		},

		_onObjectMatched: function (oEvent) {
			this.getView().bindElement({
				path: "/UsersData/" + oEvent.getParameter("arguments").index,
				model: "usersData"
			});			
			this._showSalaryChart(true);
		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("usersList", true);
			}
			this._toggleButtonsAndView(false);
		},

		onEditBtnPress() {
			this._toggleButtonsAndView(true);
			this._showSalaryChart(false);
			this._bindModelToForm(this.getView().getModel("usersData"));
		},

		onSaveBtnPress() {
			this._toggleButtonsAndView(false);
			this._showSalaryChart(true);
			this._getEditedData();
			// TODO: clear binding on save
			// this._bindModelToForm(this.getView().getModel("usersData"));
		},

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

		_toggleButtonsAndView: function (bEdit) {
			var oView = this.getView();
			if (bEdit) {
				oView.byId("saveBtn").setVisible(true);
			} else {
				oView.byId("saveBtn").setVisible(false);
			}
			this._showFormFragment(bEdit ? "userDetailsEdit" : "userDetailsDisplay");			
		},

		_showFormFragment: function (sFragmentName) {
			var oView = this.getView();
			oView.byId(sFragmentName).setVisible(true);
			var aFragments = this.getView().getModel("formFragments").getProperty("/fragments");
			var fragmentsToHide = aFragments.filter(fragment => fragment != sFragmentName);
			fragmentsToHide.forEach(fragment => this._hideFormFragment(fragment));
		},

		_hideFormFragment: function (sFragmentName) {
			this.getView().byId(sFragmentName).setVisible(false);
		},

		_bindModelToForm: function (oModel) {
			var oForm = this.getView().byId("userDetailsEdit");
			var oModel = this.getView().getBindingContext("usersData").getModel();
			var oEditedUser = this.getView().getBindingContext("usersData").getObject();
			oModel.setProperty("/EditedUser", oEditedUser);

			this.getView().setModel(oModel, "editedUser");
			oForm.setBindingContext(new Context(oModel, "/EditedUser"), "editedUser");
		},

		_getEditedData: function () {
			var oForm = this.getView().byId("userDetailsEdit");
			var oNewUser = oForm.getBindingContext("editedUser").getObject();

			var oBinding = this.getView().getBindingContext("usersData").getPath();
			var index = oBinding.split("/")[2];

			var oModel = this.getView().getModel("usersData");
			var aItems = oModel.getProperty("/UsersData");
			aItems[index] = oNewUser;
			oModel.setProperty("/UsersData", aItems);
			this._clearEditedUserContext();
		},

		_clearEditedUserContext: function() {
			var oModel = this.getView().getModel("usersData");
			oModel.setProperty("/EditedUser", {}); //clear model after close
		}
	});
});