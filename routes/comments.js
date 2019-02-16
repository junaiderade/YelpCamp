var express=require ("express");
var Camp= require("../models/camp");
var Comment=require("../models/comment");
var router =express.Router();
var middleware2=require("../middleware/index.js");






//CREATE A NEW COMMENT
//-----------------
router.get("/campgrounds/:id/comments/new", middleware2.isLoggedIn, function(req, res){ //middleware here
    //find campground.id
    Camp.findById(req.params.id,function(err, campground){ //looks up comment using id in url
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new.ejs", {campground1: campground});
        }
        
    });
});

//COMMENT POST ROUTE-gets form submitted to
//------------------
router.post("/campgrounds/:id/comments", middleware2.isLoggedIn, function(req, res){ 
   //lookup campground using ID
   Camp.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               console.log("comment");
               req.flash("success", "Comment Posted");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


//EDIT COMMENTS ROUTE
//-----------------------
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware2.checkCommentOwnership, function(req, res){
    Camp.findById(req.params.id, function(err,foundCamp){ //this is for special error with url
        if (err || !foundCamp){ //makes sure campground in url exists
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else {
                res.render("comments/edit.ejs",{campground3: req.params.id, comment1: foundComment});
        }
    });
    
    });
    
});

//UPDATE COMMENTS ROUTE
//---------------------
router.put("/campgrounds/:id/comments/:comment_id",middleware2.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    }); //req.body.comment comes from the edit.ejs file for comments where it's comment[text]
    //remember the parameters are id, new data,
});

//DESTROY COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware2.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});








module.exports = router; 