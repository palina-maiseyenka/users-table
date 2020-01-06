sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    
    return Controller.extend("palina.maiseyenka.controller.UsersList", {

        openAddUserModal: function () {
            this.getOwnerComponent().openAddUserModal();            
        }
        
	});
});