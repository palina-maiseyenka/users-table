sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "./AddUserModal",
    "sap/m/MessageBox"
], function (BaseController, Filter, FilterOperator, AddUserModal, MessageBox) {
    "use strict";

    return BaseController.extend("palina.maiseyenka.controller.UsersList", {

        /** Variable to collect all filters */
        _aFilter: [],

        /* =========================================================== */
		/* lifecycle methods                                           */
        /* =========================================================== */
        
        onInit: function () {
            var oView = this.getView();

            this._addUserModal = new AddUserModal(oView);
        },

        exit: function () {
            this._addUserModal.destroy();
            delete this._addUserModal;
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */		

        /**
		 * Event handler for adding new user button press.
		 * Opens modal dialog with form to add new user.
		 * @public
		 */
        onOpenAddUserModal: function () {
            this._addUserModal.open();
        },

        /**
		 * Event handler for deleting users button press.
		 * Opens confirm message box.
         * Deletes selected users on confirm button press.
		 * @public
		 */
        onOpenConfirmDeleteUserMB: function () {
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            var oBundle = this.getResourceBundle();
            var sMsg = oBundle.getText("deleteUserConfirmMessage");
			MessageBox.confirm(
				sMsg, {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: function (sButton) {
                        if(sButton === MessageBox.Action.OK) {                            
                            this._deleteSelectedUsers();
                        }
                    }.bind(this)
				}
            );
        },

        /**
		 * Event handler for selecting users in table by toggling checkboxes.
		 * Toggles delete button.
		 * @public
		 */
        onSelectionChange: function () {
            var aSelectedUsers = this.oView.byId("usersTable").getSelectedContextPaths();
            this.enableBtn("deleteBtn", !!aSelectedUsers.length);
        },

        /**
		 * Event handler for filterBar clear filters button press.
		 * Clears all filters.
		 * @public
		 */
        onClearFiltersBtnPress: function () {
            var oTable = this.oView.byId("usersTable");
            var oBinding = oTable.getBinding("items");
            this._aFilter = [];
            oBinding.filter(this._aFilter);

            this.oView.byId("nameFilter").setValue("");
            this.oView.byId("ageFilter").setValue("");
            this.oView.byId("genderFilter").setSelectedKey(null);
        },

        /**
		 * Event handler for selecting table row.
		 * Navigates to selected user details page.
         * @param {sap.ui.base.Event} oEvent an event containing pressed row.
		 * @public
		 */
        onTableRowPress: function (oEvent) {
            var oItem = oEvent.getSource();
            // splits Path ("/UsersData/0/") to get index
            var sIndex = oItem.getBindingContext("usersData").getPath().split("/")[2];
            var oRouter = this.getRouter();
            oRouter.navTo("userDetails", {
                index: sIndex
            });
        }, 

        /**
		 * Event handler for filter input change.
		 * Creates filter and pushes it into _aFilter variable
         * @function
		 * @param {string} sFnName name of a function for filter creation
		 * @public
		 */
        onFilterChange: function (sFnName) {
            var oTable = this.oView.byId("usersTable");
            var oBinding = oTable.getBinding("items");
            var oFilter = this[sFnName]();
            this._aFilter = this._aFilter.filter(function (filter) {
                return filter.sPath != oFilter.sPath
            });
            this._aFilter.push(oFilter);
            oBinding.filter(this._aFilter);
        },
        
        /* =========================================================== */
		/* internal methods                                            */
        /* =========================================================== */

        /**
		 * Deletes selected users from model.
		 * @function
		 * @private
		 */
        _deleteSelectedUsers: function () {
            var aSelectedUsers = this.oView.byId("usersTable").getSelectedContextPaths();
            var oModel = this.getModel("usersData");
            var aUsers = oModel.getProperty("/UsersData");
            var aUsersForDeletion = [];
            aUsersForDeletion = aSelectedUsers.map(function(sPath) {
                return oModel.getProperty(sPath);
            });            
            var aNewUsers = aUsers.filter(function(index) {
               return aUsersForDeletion.indexOf(index) < 0;
            });
            oModel.setProperty("/UsersData", aNewUsers);
            this.oView.byId("usersTable").removeSelections();
            this.enableBtn("deleteBtn", false);
        },

        /**
		 * Creates name filter.
         * Name value should contain input string.
		 * @function
         * @returns {sap.ui.model.Filter} filter by name which contains input value.
		 * @private
		 */
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

        /**
		 * Creates age filter.
         * Age value should be greater then or less then input value.
         * Filter operator depends on comparison sign selected by user.
		 * @function
         * @returns {sap.ui.model.Filter} filter by age which is greater or less than input value.
		 * @private
		 */
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

        /**
		 * Creates gender filter.
         * Gender value should be equal to selected value.
		 * @function
         * @returns {sap.ui.model.Filter} filter by gender which is equal to input value.
		 * @private
		 */
        _createGenderFilter: function () {
            var sFilterValue = this.oView.byId("genderFilter").getSelectedKey();
            if (!sFilterValue) {
                return;
            }
            var oFilter = new Filter("gender", FilterOperator.EQ, sFilterValue);
            return oFilter;
        }
    });
});