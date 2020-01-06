sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("palina.maiseyenka.controller.UserDetails", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("userDetails").attachPatternMatched(this._onObjectMatched, this);
			this.byId('editBtn').setEnabled(true);
			this._showFormFragment("UserDetailsDisplay");

		},

		_onObjectMatched: function (oEvent) {
			this.getView().bindElement({
				path: "/UsersData/" + oEvent.getParameter("arguments").invoicePath,
				model: "usersData"
			});
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
		},

		_formFragments: {},

		onExit: function () {
			for (var sPropertyName in this._formFragments) {
				if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
					return;
				}
				this._formFragments[sPropertyName].destroy();
				this._formFragments[sPropertyName] = null;
			}
		},

		onEditBtnPress(oEvent) {
			var sText = oEvent.getSource().getText();
			if (sText === "Edit") {
				this._toggleButtonsAndView(true);
			} else if (sText === "Save") {
				this._getEditedData();
				this._toggleButtonsAndView(false);
			}
		},

		onDeleteBtnPress(oEvent) {
			var oBinding = this.getView().getBindingContext("usersData").getPath();
			var index = oBinding.substr(11);
			var oModel = this.getView().getModel("usersData");
			var aItems = oModel.getProperty("/UsersData");
			aItems.splice(index, 1);
			oModel.setProperty("/UsersData", aItems);
			this.onNavBack();
		},

		_toggleButtonsAndView: function (bEdit) {
			var oView = this.getView();
			oView.byId("editBtn").setText(bEdit ? "Save" : "Edit");
			this._showFormFragment(bEdit ? "UserDetailsEdit" : "UserDetailsDisplay");
		},

		_showFormFragment: function (sFragmentName) {
			var oForm = this.byId("userFormContainer");
			oForm.destroyItems();
			oForm.addItem(this._getFormFragment(sFragmentName));
		},

		_getFormFragment: function (sFragmentName) {
			var oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "palina.maiseyenka.view." + sFragmentName);
			this._formFragments[sFragmentName] = oFormFragment;
			return this._formFragments[sFragmentName];
		},

		_getEditedData: function () {	
			var sName = sap.ui.getCore().byId((this.createId("nameInput"))).getValue();
			var sSurname = sap.ui.getCore().byId((this.createId("surnameInput"))).getValue();
			var sGender = sap.ui.getCore().byId((this.createId("genderSelect"))).getSelectedKey();
			var iAge = sap.ui.getCore().byId((this.createId("ageInput"))).getValue();
			var sCountry = sap.ui.getCore().byId((this.createId("countryInput"))).getValue();
			var sCity = sap.ui.getCore().byId((this.createId("cityInput"))).getValue();
			var sEmail = sap.ui.getCore().byId((this.createId("emailInput"))).getValue();

			var oNewUser = {
				"name": {
					"first": sName,
					"last": sSurname
				},
				"gender": sGender,
				"dob": {
					"age": iAge
				},
				"location": {
					"country": sCountry,
					"city": sCity
				},
				"email": sEmail
			};

			var oBinding = this.getView().getBindingContext("usersData").getPath();
			var index = oBinding.substr(11);

			var oModel = this.getView().getModel("usersData");
			var aItems = oModel.getProperty("/UsersData");
			aItems[index] = oNewUser;
			oModel.setProperty("/UsersData", aItems);
		}

	});
});