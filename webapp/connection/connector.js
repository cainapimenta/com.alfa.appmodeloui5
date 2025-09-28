sap.ui.define(
    [
        "sap/ui/model/odata/v2/ODataModel"
    ],
    function (oDataModel) {
        "use strict";

        return {
            init: function (oComponent) {
                this._oComponent = oComponent;
                const uri = "V2/(S(2mwdgxjrg3nzs1ygvy53i4oz))/OData/OData.svc/";
                const url = this._oComponent.getManifestObject().resolveUri(uri);

                this.oData = new oDataModel(url, { useBatch: false });
            },
            update: function (path, data, options = {}) {
                return new Promise((success, error) => {
                    this.oData.update(path, data, {
                        ...options,
                        success: (response) => {
                            success(response);
                        },
                        error
                    })
                })
            },
            delete: function (path, options = {}) {
                return new Promise((success, error) => {
                    this.oData.remove(path, {
                        ...options,
                        success: () => {
                            success();
                        },
                        error
                    })
                })
            },
            create: function (path, data, options = {}) {
                return new Promise((success, error) => {
                    this.oData.create(path, data, {
                        ...options,
                        success: (response) => {
                            return success(response);
                        },
                        error
                    })
                })
            }
        }
    }
);