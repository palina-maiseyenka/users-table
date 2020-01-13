sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "./AddUserModal",
    "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, AddUserModal, MessageBox) {
    "use strict";

    return Controller.extend("palina.maiseyenka.controller.UsersList", {

        onInit: function () {
            var oView = this.getView();

            this._addUserModal = new AddUserModal(oView);

            var oModel = this.getOwnerComponent().getModel("usersData");
            oModel.setProperty("/UsersForDeletion", []);  
        },

        exit: function () {
            this._addUserModal.destroy();
            delete this._addUserModal;
        },

        openAddUserModal: function () {
            this._addUserModal.open();
        },

        openConfirmDeleteUserMB: function () {
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var oView = this.getView();
            var oBundle = oView.getModel("i18n").getResourceBundle();
            var sMsg = oBundle.getText("deleteUserConfirmMessage");
            var deleteUsers = this._deleteSelectedUsers;
			MessageBox.confirm(
				sMsg, {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: function (sButton) {
                        if(sButton === MessageBox.Action.OK) {                            
                            deleteUsers(oView);
                        }
                    }
				}
            );
        },

        onSelectionChange: function (oEvent) {
            var aSelected = oEvent.getSource().getSelectedContextPaths();  
            var oModel = this.oView.getModel("usersData");
            var aUsersForDeletion = [];
            aSelected.map(sPath => {
                var oSelectedUser = oModel.getProperty(sPath);
                aUsersForDeletion.push(oSelectedUser);
            })
            oModel.setProperty("/UsersForDeletion", aUsersForDeletion);
            this._toggleDeleteButton(aUsersForDeletion);        
        },

        _toggleDeleteButton: function (aUsersForDeletion) {
            var oDeleteUsersBtn = this.oView.byId("deleteUsersBtn");
            if (!aUsersForDeletion.length) {
                oDeleteUsersBtn.setEnabled(false);
                return;
            }
            oDeleteUsersBtn.setEnabled(true);
        },

        _deleteSelectedUsers: function (oView) {
            var oModel = oView.getModel("usersData");
            var aUsers = oModel.getProperty("/UsersData");
            var aUsersForDeletion = oModel.getProperty("/UsersForDeletion");
            var aNewUsers = aUsers.filter(index => aUsersForDeletion.indexOf(index) < 0);
            oModel.setProperty("/UsersData", aNewUsers);
            oView.byId("usersTable").removeSelections();
            oView.byId("deleteUsersBtn").setEnabled(false);
        },
       
        _aFilter: [],

        onFilterChange: function (sFnName) {
            debugger;
            var oTable = this.oView.byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var oFilter = this[sFnName]();
            this._aFilter = this._aFilter.filter(filter => filter.sPath != oFilter.sPath);
            this._aFilter.push(oFilter);
            oBinding.filter(this._aFilter);
        },

        onClearFiltersBtnPress: function () {
            var oTable = this.oView.byId("usersTable");
            var oBinding = oTable.getBinding("items");
            this._aFilter = [];
            oBinding.filter(this._aFilter);

            this.oView.byId("nameFilter").setValue("");
            this.oView.byId("ageFilter").setValue("");
            this.oView.byId("genderFilter").setSelectedKey("");
        },

        _createNameFilter: function () {
            var sFilterValue = this.oView.byId("nameFilter").getValue();
            var oFilter = new Filter({
                filters: [
                    new Filter("name/first", FilterOperator.Contains, sFilterValue),
                    new Filter("name/last", FilterOperator.Contains, sFilterValue),
                ],
                and: false
            });
            return oFilter;
        },

        _createAgeFilter: function () {
            var iFilterValue = this.oView.byId("ageFilter").getValue();
            var sComparisonSign = this.oView.byId("ageComparison").getSelectedKey();
            var sFilterOperator;
            switch (sComparisonSign) {
                case "more":
                    sFilterOperator = FilterOperator.GT;
                    break;
                case "less":
                    sFilterOperator = FilterOperator.LT;
                    break;
            }
            var oFilter = new Filter("dob/age", sFilterOperator, iFilterValue);
            return oFilter;
        },

        _createGenderFilter: function () {
            var sFilterValue = this.oView.byId("genderFilter").getSelectedKey();
            if (!sFilterValue) {
                return;
            }
            var oFilter = new Filter("gender", FilterOperator.EQ, sFilterValue);
            return oFilter;
        },

        onTableRowPress: function (oEvent) {
            var oItem = oEvent.getSource();

            // splits Path ("/UsersData/0/") to get index
            var sIndex = oItem.getBindingContext("usersData").getPath().split("/")[2];
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("userDetails", {
                index: sIndex
            });
        },
    });
});