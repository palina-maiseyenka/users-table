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

        validateValue: function () {
            var email = this.getView().byId("emailInput").getValue();
            var mailregex = new RegExp(/^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/);
            if (!mailregex.test(email)) {
                throw new ValidateException(email + " is not a valid email address");
            }
        }
    });
});