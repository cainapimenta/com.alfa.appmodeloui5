sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "com/alfa/appmodeloui5/connection/connector"
],
    function (JSONModel, Device, connector) {
        "use strict";

        return {
            /**
             * Provides runtime information for the device the UI5 app is running on as a JSONModel.
             * @returns {sap.ui.model.json.JSONModel} The device model.
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createProduct: function (data) {
                return connector.create("/Products", data);
            },
            deleteProduct: function (sProductId) {
                return connector.delete(`/Products(${sProductId})`);
            }
        };

    });