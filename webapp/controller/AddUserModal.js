sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/ui/core/Fragment",
	"sap/ui/model/Context"
], function (ManagedObject, Fragment, Context) {
	"use strict";

	return ManagedObject.extend("palina.maiseyenka.controller.AddUserModal", {

		constructor: function (oView) {
			this._oView = oView;
		},

		exit: function () {
			delete this._oView;
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		open: function () {

			var oView = this._oView;

			if (!oView.byId("addUserDialog")) {
				var oFragmentController = {
					onCloseDialog: function () {
						oView.byId("createUserForm").getBindingContext().destroy();
						oView.byId("addUserDialog").close();
					},

					onSubmitDialog: function () {
						var oMessages = oView.getModel("message").getData();
						var oModel = oView.getModel("usersData");
						var oForm = oView.byId("createUserForm");
						var oNewUser = oForm.getBindingContext().getObject();
						if (oMessages.length !== 0 || !this._isObjectFilled(oNewUser)) {
							return;					
						}
						var aItems = oModel.getProperty("/UsersData");
						aItems.push(oNewUser);
						oModel.setProperty("/UsersData", aItems);
						this.onCloseDialog();
					},

					onInputChange: function (oEvent) {
						var sValue = oEvent.getParameter("value");
						var oInput = oEvent.getSource();
						var oMessages = oView.getModel("message").getData();
						var oForm = oView.byId("createUserForm");
						var oNewUser = oForm.getBindingContext().getObject();
						if (oMessages.length !== 0 || !this._isObjectFilled(oNewUser)) {
							oView.byId("submitBtn").setEnabled(false);
							return;
						} else {
							oView.byId("submitBtn").setEnabled(true);
						}
						if (sValue === "") {
							oInput.setValueState(sap.ui.core.ValueState.Error);
						} else {
							oInput.setValueState(sap.ui.core.ValueState.None);
						}
					},

					_isObjectFilled: function (object) {
						for (var key in object) {
							if (typeof object[key] === "object") {
								this._isObjectFilled(object[key]);
							}
							if (!object[key]) {
								return false;
							}
						}
						return true;
					}
				};
				Fragment.load({
					id: oView.getId(),
					name: "palina.maiseyenka.view.fragments.AddUserModal",
					controller: oFragmentController
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				oView.byId("addUserDialog").open();
			}

			var oModel = oView.getModel("usersData");
			oModel.setProperty("/NewUser", {
				"name": {
					"first": "",
					"last": ""
				},
				"gender": "",
				"dob": {
					"age": null
				},
				"location": {
					"country": "",
					"city": ""
				},
				"email": ""
			});
			var oForm = oView.byId("createUserForm");
			oForm.setModel(oModel);
			oForm.setBindingContext(new Context(oModel, "/NewUser"));

			var oMessageManager = sap.ui.getCore().getMessageManager();
			oView.setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(oView.byId("createUserForm"), true);
		}
	});
});