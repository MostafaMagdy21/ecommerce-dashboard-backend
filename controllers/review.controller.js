const Review = require('../models/review');

function createReview(req,res){
    if (!req.body) {
        return res.status(400).json({ message: "Request body cannot be empty." });
    }

   const { productId, customerId, rating, comment } = req.body;

   if (!productId || !rating) {
    return res.status(400).json({
        message: "productId and rating are required."
    });
}



   const newReview = new Review({
       productId,
       customerId,
       rating,
       comment,
   });

   // Save the review to the database
   newReview.save()
       .then(review => {
           res.status(201).json({
               message: "Review created successfully",
               url: "http://localhost:5000/review/create",  
               method: "POST",
               review: review
           });
       })
       .catch(err => {
           res.status(500).json({ 
               message: "Error creating review", 
               error: err 
           });
       });
}

function showAllReviews(req,res){

    Review.find({})
    // .select('title _id') 
    .then(reviews => {
        if (reviews.length === 0) {
            res.status(404).json({
                message: "No reviews Yet",
                method: "GET",
                statusCode: "404"
            });
        } else {
            res.status(200).json({
                message: "reviews Retrieved Successfully",
                method: "GET",
                url: "http://localhost:5000/review",
                statusCode: "200",
                reviews: reviews
            });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });






}

function showSingleReview(req,res){
    const  id  = req.params.id;
    Review.findById(id)
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.status(200).json({
                message: "Review retrieved successfully",
                review: review
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

}

function showByProductId(req,res){

    const { productId } = req.params;
    Review.find({ productId })
        .then(reviews => {
            if (reviews.length === 0) {
                return res.status(404).json({
                    message: "No reviews found for this product.",
                    method: "GET",
                    statusCode: 404
                });
            }
            res.status(200).json({
                message: "Reviews retrieved successfully",
                reviews: reviews
            });
        })
        .catch(err => {
            res.status(500).json({ 
                message: "Error retrieving reviews", 
                error: err 
            });
        });



}



function updateReview(req,res){
    const id = req.params.id;
    const updatedData = {
        rating: "",
        comment:""
    };

for(const key in updatedData){
updatedData[key]=req.body[key];
}

Review.findByIdAndUpdate(id, updatedData, { new: true })
.then(review => {
    if (review) {
             res.status(200).json({
                message: "Review Updated Successfully",
                review: review
            });
       
    }
     else {
    res.status(404).json({
            message: "Error 404: Review Not Found"
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

function deleteReview(req,res){
    const id = req.params.id;

    Review.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Review Deleted Successfully",
                    deleteReview : result
                });
            } else {
                res.status(404).json({
                    message: "Error 404: Review Not Found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || "There is an error for deleting the Review."
            });
        });


}


function showByUser(req,res){}

module.exports= {
    createReview,
    updateReview,
    deleteReview,
    showAllReviews,
    showSingleReview,
    showByProductId,
    showByUser,
}