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
            var sFilterValue = this.getView().byId("nameFilter").getValue();
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            if (sFilterValue) {
                aFilter.push(new Filter({
                    filters: [
                        new Filter("name/first", FilterOperator.Contains, sFilterValue),
                        new Filter("name/last", FilterOperator.Contains, sFilterValue),
                    ],
                    and: false
                }));
            }
            oBinding.filter(aFilter);
        },

        onAgeFilterChange: function () {
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
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            if (iFilterValue) {
                aFilter.push(new Filter("dob/age", sFilterOperator, iFilterValue));
            }
            oBinding.filter(aFilter);
        },

        onGenderFilterChange: function () {
            var sFilterValue = this.getView().byId("genderFilter").getSelectedKey();
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            if (sFilterValue) {
                aFilter.push(new Filter("gender", FilterOperator.EQ, sFilterValue));
            }
            oBinding.filter(aFilter);
        },

        onMultipleFilterBtnPress: function () {
            var sNameFilterValue = this.getView().byId("nameFilter").getValue();
            var iAgeFilterValue = this.getView().byId("ageFilter").getValue();
            var sGenderFilterValue = this.getView().byId("genderFilter").getSelectedKey();
            var oTable = this.getView().byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var aFilter = [];
            if (sNameFilterValue || iAgeFilterValue || sGenderFilterValue) {
                aFilter.push(new Filter({
                    filters: [
                        new Filter("name/first", FilterOperator.Contains, sNameFilterValue),
                        new Filter("name/last", FilterOperator.Contains, sNameFilterValue)
                    ],
                    and: false
                }));
                aFilter.push(new Filter("dob/age", FilterOperator.GE, iAgeFilterValue));
                aFilter.push(new Filter("gender", FilterOperator.EQ, sGenderFilterValue));
            }
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
        }
    });
});