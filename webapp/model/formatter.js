sap.ui.define([

], () => {
    "use strict";

    return {
        isUserAllowedToEdit: function (scopes) {
            if (!scopes) {
                return false;
            }

            return scopes.some((scope) => scope.includes('FIORI_APP_MODELO_ADMIN'));
        },
    }
});