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
                throw new ValidateException("Enter a value that has more than 3 symbols");
            }
        }
    });
});