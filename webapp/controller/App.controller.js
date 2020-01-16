sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("palina.maiseyenka.controller.App", {
		onInit: function () {
			var oViewModel = new JSONModel({
				"fragmentsVisibility": {
					"userDetailsDisplay": true,
					"userDetailsEdit": false,
					"salaryChart": true,
					"noSalaryDataText": false,
				},
				"buttonsVisibility": {
					"deleteBtn": false,
					"saveBtn": true,
					"submitBtn": false
				},
				"fragments": [
					"userDetailsEdit",
					"userDetailsDisplay"
				],
				"activeFragment": ""
			});
			this.setModel(oViewModel, "appView");
		}
	});
});