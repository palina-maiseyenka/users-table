sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "palina/maiseyenka/model/customEmailType"
], function (SimpleType, ValidateException) {
    "use strict";

    return SimpleType.extend("palina.maiseyenka.model.customEmailType", {

        formatValue: function (sValue) {
            return sValue;
        },

        parseValue: function (sValue) {
            return sValue;
        },

        validateValue: function (sValue) {
            //input value should match example@mail.com pattern
            var emailRegex = new RegExp(/^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/);
            if (!emailRegex.test(sValue)) {
                throw new ValidateException(sValue + " is not a valid email address. Value should match pattern example@mail.com");
            }
        }
    });
});