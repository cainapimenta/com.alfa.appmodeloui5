sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/alfa/appmodeloui5/model/models",
    "com/alfa/appmodeloui5/connection/connector"
], (UIComponent, models, connector) => {
    "use strict";

    return UIComponent.extend("com.alfa.appmodeloui5.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            connector.init(this);
        }
    });
});