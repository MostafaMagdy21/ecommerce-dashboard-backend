
const Product = require('../models/product');

function createProduct(req, res) {
    const product = new Product({
        sku: req.body.sku,
        title: req.body.title,
        price: {
            base: req.body.price.base,
            discount: req.body.price.discount || null 
        },
        description: req.body.description || null, 
        images: req.body.images, 
        categoryId: req.body.categoryId || null, 
        quantity: req.body.quantity,
        options: {
            vitamens: req.body.options.vitamens || [], 
            size: req.body.options.size || [], 
            scent: req.body.options.scent || [], 
            gender: req.body.options.gender || [] 
        },
        tags: req.body.tags || [], 
        rating: req.body.rating || null, 
        status: req.body.status,
        // createdAt: new Date(),
        // updatedAt: new Date(),
        createdBy: req.body.createdBy || null 
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
                error: err.message || "There is an erroe while creating product."
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
        .select('title _id') 
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
        sku: req.body.sku,
        title: req.body.title,
        price: {
            base: req.body.price.base,
            discount: req.body.price.discount || null
        },
        description: req.body.description || null,
        images: req.body.images,
        categoryId: req.body.categoryId || null,
        quantity: req.body.quantity,
        options: {
            vitamins: req.body.options.vitamins || [],
            size: req.body.options.size || [],
            scent: req.body.options.scent || [],
            gender: req.body.options.gender || []
        },
        tags: req.body.tags || [],
        rating: req.body.rating || null,
        status: req.body.status,
        updatedAt: new Date()
    };

    Product.findByIdAndUpdate(id, updatedData, { new: true })
        .then(product => {
            if (product) {
                res.status(200).json({
                    message: "Product Updated Successfully",
                    product: product
                });
            } else {
                res.status(404).json({
                    message: "Error 404: Product Not Found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || "There is an error for updating the product."
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