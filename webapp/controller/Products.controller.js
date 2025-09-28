sap.ui.define([
    "../controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "com/alfa/appmodeloui5/model/models"
], (BaseController, MessageToast, MessageBox, JSONModel, models) => {
    "use strict";

    return BaseController.extend("com.alfa.appmodeloui5.controller.Products", {
        onInit() {
        },

        handleCreateProduct() {
            const viewId = this.getView().getId();

            const oData = {
                ID: "",
                Name: "",
                Description: "",
                Rating: 0,
                Price: 0.00
            };

            this.setModel(oData, "createProduct");

            if (!this._createDialog) {
                this._createDialog = sap.ui.xmlfragment(viewId, 'com.alfa.appmodeloui5.view.fragments.CreateProduct', this);
                this.getView().addDependent(this._createDialog);
            }

            this._createDialog.open();
        },

        handleDeleteProduct(oEvent) {
            const oSelectedItem = oEvent.getSource();
            const oContext = oSelectedItem.getBindingContext();
            const sProductId = oContext.getProperty('ID');
            const sProductName = oContext.getProperty('Name');
            const oModel = this.getModel();

            MessageBox.confirm(`Tem certeza que deseja remover o produto '${sProductName}'?`, {
                title: "Alerta de removação",
                icon: MessageBox.Icon.WARNING,
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        this.setBusy(true);

                        models.deleteProduct(sProductId)
                            .then(() => {
                                oModel.refresh();
                                MessageBox.success("Produto removido com sucesso!");

                            })
                            .catch((oError) => {
                                MessageBox.error(oError);
                            })
                            .finally(() => {
                                this.setBusy(false);
                            });
                    }
                }
            })
        },

        onCreateProductDialog(oEvent) {
            const oCreateModel = this.getModel("createProduct");
            const oData = oCreateModel.getData();
            const oModel = this.getModel();

            models.createProduct(oData)
                .then((res) => {
                    MessageBox.success(`Produto '${res.Name}' foi criado com sucesso!`);
                    oModel.refresh();
                    this._createDialog.close();
                })
                .catch((oError) => {
                    MessageBox.error(oError);
                });
        },

        onCloseDialog(oEvent) {
            const oDialog = oEvent.getSource().getParent();
            oDialog.close();
        }
    });
});