sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"./controller/AddUserModal"
], function (UIComponent, JSONModel, AddUserModal) {
	"use strict";

	return UIComponent.extend("palina.maiseyenka.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();

			this._addUserModal = new AddUserModal(this.getRootControl());
		},

		exit : function() {
			this._addUserModal.destroy();
			delete this._addUserModal;
		},

		openAddUserModal : function () {
			this._addUserModal.open();
		}
	});

});