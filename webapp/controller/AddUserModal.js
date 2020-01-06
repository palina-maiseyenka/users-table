sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Fragment"
], function (ManagedObject, Fragment) {
	"use strict";

	return ManagedObject.extend("palina.maiseyenka.controller.AddUserModal", {

		constructor: function (oView) {
			this._oView = oView;
		},

		exit: function () {
			delete this._oView;
		},

		open: function () {
			var oView = this._oView;


			if (!oView.byId("addUserDialog")) {
				var oFragmentController = {
					onCloseDialog: function () {
						oView.byId("addUserDialog").close();
					},

					onSubmitDialog: function () {
						var sName = oView.byId("nameInput").getValue();
						var sSurname = oView.byId("surnameInput").getValue();
						var sGender = oView.byId("genderSelect").getSelectedKey();
						var iAge = oView.byId("ageInput").getValue();
						var sCountry = oView.byId("countryInput").getValue();
						var sCity = oView.byId("cityInput").getValue();
						var sEmail = oView.byId("emailInput").getValue();

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

						var oModel = sap.ui.getCore().getModel("usersData");
						var aItems = oModel.getProperty("/UsersData");
						aItems.push(oNewUser);
						oModel.setProperty("/UsersData", aItems);
						this.onCloseDialog();
					}
				};
				Fragment.load({
					id: oView.getId(),
					name: "palina.maiseyenka.view.AddUserModal",
					controller: oFragmentController
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				oView.byId("addUserDialog").open();
			}
		}
	});
});