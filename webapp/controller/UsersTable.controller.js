sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("palina.maiseyenka.controller.UsersTable", {

        onInit: function () {
            var oJSONModel = this.getOwnerComponent().getModel("usersData");
            sap.ui.getCore().setModel(oJSONModel, "usersData");
        },

        onNameFilterChange: function () {
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            aFilter.push(this._createNameFilter());
            oBinding.filter(aFilter);
        },

        onAgeFilterChange: function () {
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            aFilter.push(this._createAgeFilter());
            oBinding.filter(aFilter);
        },

        onGenderFilterChange: function () {
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            aFilter.push(this._createGenderFilter());
            oBinding.filter(aFilter);
        },

        onMultipleFilterBtnPress: function () {
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            aFilter.push(this._createNameFilter());
            aFilter.push(this._createAgeFilter());
            aFilter.push(this._createGenderFilter());           
            oBinding.filter(aFilter);
        },

        onClearFiltersBtnPress: function () {
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            oBinding.filter(aFilter);

            this.getView().byId("nameFilter").setValue('');
            this.getView().byId("ageFilter").setValue('');
            this.getView().byId("genderFilter").setSelectedKey('');
        },

        onTableRowPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var sPath = oItem.getBindingContext("usersData").getPath().substr(11);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("userDetails", {
                invoicePath: sPath
            });
        },

        _createNameFilter: function () {
            var sFilterValue = this.getView().byId("nameFilter").getValue();
            var oFilter;
            oFilter = new Filter({
                filters: [
                    new Filter("name/first", FilterOperator.Contains, sFilterValue),
                    new Filter("name/last", FilterOperator.Contains, sFilterValue),
                ],
                and: false
            });
            return oFilter;
        },

        _createAgeFilter: function () {
            var iFilterValue = this.getView().byId("ageFilter").getValue();
            var sComparisonSign = this.getView().byId("ageComparison").getSelectedKey();
            var sFilterOperator;
            switch (sComparisonSign) {
                case "more":
                    sFilterOperator = FilterOperator.GT;
                    break;
                case "less":
                    sFilterOperator = FilterOperator.LT;
                    break;
            }
            var oFilter;
            oFilter = new Filter("dob/age", sFilterOperator, iFilterValue);
            return oFilter;
        },

        _createGenderFilter: function () {
            var sFilterValue = this.getView().byId("genderFilter").getSelectedKey();
            var oFilter;
            oFilter = new Filter("gender", FilterOperator.EQ, sFilterValue);
            return oFilter;
        },
    });
});