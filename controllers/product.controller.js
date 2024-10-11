
const Product = require('../models/product');

function createProduct(req, res) {
    const product = new Product({
        sku: req.body.sku,
        title: req.body.title,
        price: {
            base: req.body.price.base,
            discount: req.body.price.discount 
        },
        description: req.body.description, 
        images: req.body.images, 
        categoryId: req.body.categoryId, 
        quantity: req.body.quantity,
        options: {
            vitamins: req.body.options.vitamins || [], 
            size: req.body.options.size || [], 
            scent: req.body.options.scent || [], 
            gender: req.body.options.gender || [] 
        },
        tags: req.body.tags || [], 
        rating: req.body.rating,
        status: req.body.status,
        createdBy: req.body.createdBy
    });

    product.save()
        .then(product => {
            res.status(201).json({
                message: "Product Created Successfully",
                method: "POST",
                url: "http://localhost:5000/product/create",  
                createdProduct: product
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
}

function showSingleProduct(req, res) {
    const id = req.params.id;
    Product.findById(id).then(product => {
        if (product) {
            res.status(200).json({
                message: "Product Retrieved Successfully",
                product: product
            });
        } else {
            res.status(404).json({
                message: "Error 404 Product Not Found"
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

function showAllProducts(req, res) {
    Product.find({})
        // .select('title _id') 
        .then(products => {
            if (products.length === 0) {
                res.status(404).json({
                    message: "No Products Yet",
                    method: "GET",
                    statusCode: "404"
                });
            } else {
                res.status(200).json({
                    message: "Products Retrieved Successfully",
                    method: "GET",
                    url: "http://localhost:5000/product",
                    statusCode: "200",
                    products: products
                });
            }
        }).catch(err => {
            res.status(500).json({ error: err });
        });
}


function updateProduct(req, res) {
    const id = req.params.id;

    const updatedData = {
        sku: "",
        title:"",
        price: {
            base: 0,
            discount: 0
        },
        description: "" ,
        images: "",
        categoryId: "" || null,
        quantity: 0,
        options: {
            vitamins: "" || [],
            size: ""|| [],
            scent: "" || [],
            gender:"" || []
        },
        tags: ""|| [],
        rating: "" || null,
        status: "",
    };

for(const key in updatedData){

updatedData[key]=req.body[key];

}

     Product.findByIdAndUpdate(id, updatedData, { new: true })
        .then(product => {
            if (product) {
                     res.status(200).json({
                        message: "Product Updated Successfully",
                        product: product
                    });
               
            }
             else {
            res.status(404).json({
                    message: "Error 404: Product Not Found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err.message ,
                errorCode: err.code
            });
        });
   
}

function deleteProduct(req, res) {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Product Deleted Successfully",
                    deleteProduct : result
                });
            } else {
                res.status(404).json({
                    message: "Error 404: Product Not Found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || "There is an error for deleting the product."
            });
        });
}



module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    showSingleProduct,
    showAllProducts,
}