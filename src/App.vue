<template>
    <el-row :gutter="20">
        <el-col :span="12" :offset="6">
            <el-dialog
                :title="title"
                width="50%"
                :visible.sync="dialogVisible">
                <el-input
                    placeholder="Product Name"
                    v-model="product.name"
                ></el-input>
                <div style="margin: 20px 0;"></div>
                <el-input
                    placeholder="Product Description"
                    v-model="product.description"
                    type="textarea"
                    :rows="3"
                ></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog()">Cancel</el-button>
                    <el-button type="primary" @click="isCreate ? createProduct() : updateProduct()">Confirm</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="Delete Product"
                width="50%"
                :visible.sync="deleteDialogVisible">
                <span>Are you sure you want to delete the "{{ product.name }}"" product?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="deleteProduct()">Confirm</el-button>
                </span>
            </el-dialog>

            <el-button type="text" @click="showDialog()">Add New Product</el-button>
            <el-table
                :data="productData"
                style="width: 100%;"
                >
                <el-table-column label="Name" prop="name"> </el-table-column>
                <el-table-column label="Description" prop="description"> </el-table-column>
                <el-table-column align="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showDialog(false, scope.row)" icon="el-icon-edit" circle></el-button>
                        <el-button type="danger" @click="showDeleteDialog(scope.row)" icon="el-icon-delete" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
import firebase from "./firebaseConfig";
const db = firebase.firestore();
export default {
    data() {
        return {
            product: {
                id: null,
                name: "",
                description: ""
            },
            title: "",
            deleteDialogVisible: false,
            dialogVisible: false,
            productData: [],
            isCreate: true,
            scope: null,
        };
    },
    methods: {
        createProduct() {
            if (this.product.name == "" || this.product.description == "") {
                this.productActions('error', 'All fields are required.');
                return;
            }

            db.collection("product")
                .add(this.product)
                .then(() => {
                    this.productActions('success', 'Successfully added new product.');
                })
                .catch(() => {
                    this.$message.error('Error adding product.');
                });

            this.resetProduct();
        },
        readproduct() {
            this.productData = [];
            db.collection("product")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((product) => {
                        this.productData.push({
                            id: product.id,
                            name: product.data().name,
                            description: product.data().description,
                        });
                    });
                })
                .catch(() => {
                    this.$message.error('Error getting products.');
                });
        },
        updateProduct() {
            db.collection("product")
            .doc(this.product.id)
            .update(this.product)
            .then(() => {
                this.productActions('success', 'Successfully updated product.');
            })
            .catch(() => {
                this.productActions('error', 'Error updating product.');
            });
        },
        deleteProduct() {
            db.collection("product")
                .doc(this.product.id)
                .delete()
                .then(() => {
                    this.productActions('success', 'Successfully deleted product.');
                })
                .catch(() => {
                    this.productActions('error', 'Error deleting product.');
                });
        },
        productActions(type, message) {
            switch(type) {
                case 'success':
                    this.$message({
                        message: message,
                        type: type
                    });

                    this.dialogVisible = false;
                    this.deleteDialogVisible = false;
                    this.readproduct();
                break;
                case 'error':
                    this.$message.error(message);
                break;
            }
        },
        closeDialog() {
            this.dialogVisible = false;
            this.readproduct();
        },
        showDialog(isCreate = true, data = null) {
            this.title = (isCreate) ? 'Create New Product' : 'Update Product';
            this.product = (data == null) ? this.resetProduct() : data;
            this.dialogVisible = true;
            this.isCreate = isCreate;
        },
        showDeleteDialog(data) {
            this.deleteDialogVisible = !this.deleteDialogVisible;
            this.product = (data == null) ? this.resetProduct() : data;
        },
        resetProduct() {
            this.product = {
                id: null,
                name: '',
                description: ''
            };

            return this.product;
        }
    },
    mounted() {
        this.readproduct();
    },
};
</script>