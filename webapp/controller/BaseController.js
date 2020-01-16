sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("palina.maiseyenka.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the usersList route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("usersList", {}, true);
			}
		},

		/**
		 * Method for changing appView model buttonVisibility property.
		 * @param {string} sButtonName name of the property
		 * @param {boolean} bIsEnabled whether to enable or not
		 * @public
		 */
		enableBtn(sButtonName, bIsEnabled) {
			var oViewModel = this.getModel("appView");
			var sBtnProperty = "/buttonsVisibility/" + sButtonName;
			oViewModel.setProperty(sBtnProperty, bIsEnabled);
		},

		/**
		 * Method for changing appView model fragmentsVisibility property.
		 * @param {string} sFragmentName name of the property
		 * @param {boolean} bIsShowed whether to set visible or not
		 * @public
		 */
		showFragment(sFragmentName, bIsShowed) {
			var oViewModel = this.getModel("appView");
			var sFragmentProperty = "/fragmentsVisibility/" + sFragmentName;
			oViewModel.setProperty(sFragmentProperty, bIsShowed);
		}
	});
});