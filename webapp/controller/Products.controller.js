sap.ui.define([
    "../controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "com/alfa/appmodeloui5/model/products",
    "com/alfa/appmodeloui5/model/formatter"
], (BaseController, MessageToast, MessageBox, JSONModel, productsModel, formatter) => {
    "use strict";

    return BaseController.extend("com.alfa.appmodeloui5.controller.Products", {
        formatter: formatter,

        onInit() {
            this.getUser();
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

                        productsModel.delete(sProductId)
                            .then(() => {
                                oModel.refresh();
                                MessageBox.success("Produto removido com sucesso!");
                            })
                            .catch((oError) => {
                                MessageBox.error(oError);
                            }).finally(() => {
                                this.setBusy(false);
                            });
                    }
                }
            })
        },

        handleUpdateProduct(oEvent) {
            const viewId = this.getView().getId();
            const oSelectedItem = oEvent.getSource();
            const oContext = oSelectedItem.getBindingContext();
            const oProduct = oContext.getObject();

            this.setModel(oProduct, "editProduct");

            if (!this._updateDialog) {
                this._updateDialog = sap.ui.xmlfragment(viewId, 'com.alfa.appmodeloui5.view.fragments.EditProduct', this);
                this.getView().addDependent(this._updateDialog);
            }

            this._updateDialog.open();
        },

        onCreateProductDialog(oEvent) {
            const oCreateModel = this.getModel("createProduct");
            const oData = oCreateModel.getData();
            const oModel = this.getModel();

            if (!oData.ReleaseDate) {
                oData.ReleaseDate = new Date(Date.now()).toLocaleDateString();
            }

            if (!oData.ID || !oData.Name || !oData.Price) {
                return MessageToast.show('Preencha os campos obrigatórios!');
            }

            this.setBusy(true);
            productsModel.create(oData)
                .then((res) => {
                    oModel.refresh();
                    MessageBox.success(`Produto '${res.Name}' foi criado com sucesso!`);
                })
                .catch((oError) => {
                    MessageBox.error(oError);
                }).
                finally(() => {
                    this._createDialog.close();
                    this.setBusy(false);
                });
        },

        onUpdateProductDialog() {

            const oModel = this.getModel();
            const oEditModel = this.getModel("editProduct");
            const oData = oEditModel.getData();

            if (!oData.ReleaseDate) {
                oData.ReleaseDate = new Date(Date.now()).toLocaleDateString();
            }

            this.setBusy(true);
            productsModel.update(oData.ID, oData)
                .then(() => {
                    oModel.refresh();
                    MessageBox.success(`Produto atualizado com sucesso!`);
                })
                .catch((oError) => {
                    MessageBox.error(oError.message);
                })
                .finally(() => {
                    this._updateDialog.close();
                    this.setBusy(false);
                })
        },

        onCloseDialog(oEvent) {
            const oDialog = oEvent.getSource().getParent();
            oDialog.close();
        },

        async getUser() {
            const oComponent = this.getOwnerComponent();
            const baseUrl = oComponent.getManifestObject().resolveUri('user-api/currentUser');

            await fetch(baseUrl)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(String(res.status));
                    }

                    return res.json();
                })
                .then((data) => {
                    this.setModel(data, 'user');
                })
                .catch((oError) => {
                    this.setModel({}, 'user');
                    // this.setModel({ scopes: ['FIORI_APP_MODELO_ADMIN'] }, 'user');
                    MessageBox.error('Erro ao buscar informações do usuário!', { details: oError.message });
                });
        }
    });
});