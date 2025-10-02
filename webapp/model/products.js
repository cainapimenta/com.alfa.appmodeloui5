sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "com/alfa/appmodeloui5/connection/connector"
],
    function (JSONModel, Device, connector) {
        "use strict";

        return {
            create: function (data) {
                return connector.create("/Products", data);
            },
            delete: function (sProductId) {
                return connector.delete(`/Products(${sProductId})`);
            },
            update: function (sProductId, data) {
                return connector.update(`/Products(${sProductId})`, data);
            }
        };
    });
