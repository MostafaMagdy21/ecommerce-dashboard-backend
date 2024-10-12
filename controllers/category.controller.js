const Category = require("../models/category");

function showAllCategories(req, res) {
	Category.find({})
	.then(categories => {
		if (categories.length === 0) {
			res.status(404).json({
				message: "No Ctegories Yet",
				method: "GET",
				statusCode: "404"
			});
		} else {
			res.status(200).json({
				message: "Categories Retrieved Successfully",
				method: "GET",
				url: "http://localhost:5000/product",
				statusCode: "200",
				categories: categories
			});
		}
	}).catch(err => {
		res.status(500).json({ error: err });
	});

	

}


function showSingleCategory(req, res) {
	const id = req.params.id;
    Category.findById(id).then(category => {
        if (category) {
            res.status(200).json({
                message: "Category Retrieved Successfully",
                category: category
            });
        } else {
            res.status(404).json({
                message: "Error 404 : category Not Found"
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });










}

function createCategory(req, res) {
    const { categoryName, description } = req.body; 

    const newCategory = new Category({
        categoryName,
        description
    });

    newCategory.save()
        .then(category => {
            res.status(201).json({
                message: "Category Created Successfully",
                url: "http://localhost:5000/category/create",
                method: "POST",
                category: category
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error creating category",
                error: err

            });
        });
}

function updateCategory(req, res) {

    const id = req.params.id;
    const updatedData = {
        categoryName: "",
        description:"",
    };

for(const key in updatedData){
updatedData[key]=req.body[key];
}


Category.findByIdAndUpdate(id, updatedData, { new: true })
.then(category => {
	if (category) {
			 res.status(200).json({
				message: "Category Updated Successfully",
				category: category
			});
	   
	}
	 else {
	res.status(404).json({
			message: "Error 404: Category Not Found"
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


function deleteCategory(req, res) {
	const id = req.params.id;

    Category.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Category Deleted Successfully",
                    deleteCategory : result
                });
            } else {
                res.status(404).json({
                    message: "Error 404: Category Not Found"
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

module.exports = {
	showSingleCategory,
	showAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
