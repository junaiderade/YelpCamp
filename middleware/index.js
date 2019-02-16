//all the middleware goes here
var middlewareObj ={};
var Camp= require("../models/camp");
var Comment=require("../models/comment");


//CAMPGROUND OWNERSHIP MIDDLEWARE
//-------------------------------
middlewareObj.checkOwnership = function(req, res,next){
    if (req.isAuthenticated()){//if request is authenticated
    Camp.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){ //this deals with the special error involving the url.
            res.redirect("back");
        } else { 
        //if there's no error check if the user id is the author is
           // console.log(foundCampground.author.id); you did these console.logs because they print out as the same but are diff objects and wont equal the same thing
           //console.log(req.user._id);
             if (foundCampground.author.id.equals(req.user._id)) { //u use .equals and not === for above reason
                      next(); //takes them to the next page they were going
                     } else {
                         req.flash("error", "Permission Denied");
                         res.redirect("back");
                     }
        }
    }); //it finds all camps by id, which is req.params.id
    } else {
        res.redirect("back"); //will take u back to the previous page u were on
    }
}


//COMMENT OWNERSHIP MIDDLEWARE
//---------------------------
middlewareObj.checkCommentOwnership=function (req, res,next){
    if (req.isAuthenticated()){//is the user logged in
    Comment.findById(req.params.comment_id, function(err, foundComment){ //req.params.comment_id comes from the routes u wrote
        if(err|| !foundComment){
            req.flash("error", "Comment Not Found");
            res.redirect("back"); 
        } else { 
            
        //if there's no error check if the user id is the author is
             if (foundComment.author.id.equals(req.user._id)) { //u use .equals and not === for above reason
                      next(); //takes them to the next page they were going
                     } else {
                         req.flash("error", "Permission Denied");
                         res.redirect("back");
                     }
        }
    }); //it finds all camps by id, which is req.params.id
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back"); //will take u back to the previous page u were on
    }
}

//LOGIN CHECK
//-----------
middlewareObj.isLoggedIn=function(req, res, next){
    if (req.isAuthenticated()){
        return next(); //in this case it first checks if the user is logged in then, take it to where it was going NEXT
    }
    req.flash("error","You need to be logged in to do that"); //this uses connect-flash for the flash message
    //flash waits till the next page to redirect so that's why u have it before
    
    res.redirect("/login"); //if the user is not logged in redirect to loginx
}






module.exports=middlewareObj
