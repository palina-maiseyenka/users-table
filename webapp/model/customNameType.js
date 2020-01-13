sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "palina/maiseyenka/model/customNameType"
], function (SimpleType, ValidateException) {
    "use strict";

    return SimpleType.extend("palina.maiseyenka.model.customNameType", {

        formatValue: function(sValue) {
            return sValue;
        },

        parseValue: function(sValue) {
            return sValue;
        },
        
        validateValue: function(sValue) {
            if(sValue.length < 3) {
                debugger
                throw new ValidateException(sValue+" is not valid");
            }
        }
    });
});