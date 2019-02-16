
var express=require ("express");
var Camp= require("../models/camp");
var router =express.Router();
var middleware1=require("../middleware/index.js");




router.get("/", function(req, res){
res.render("landingPage.ejs");
});



//NEW-show form to create new campground
//--------------------------------------

router.get("/campgrounds/new", middleware1.isLoggedIn, function (req, res){ //shows the form
    res.render("campgrounds/new.ejs");
    
});


//INDEX- show all campgrounds
//---------------------------
router.get("/campgrounds", function (req, res){ //even tho its an array now it will be changed to a database soon
    Camp.find({}, function(err, allCamps){ //gets all campgrounds at database and shows them
        if(err){
            console.log(err);
        } else {
     res.render("campgrounds/index.ejs", {campgrounds: allCamps, currentUser: req.user});
        }
    });
});


//CREATE- add new campgrounds
//---------------------------
router.post("/campgrounds", middleware1.isLoggedIn, function( req, res){
  var name = req.body.name; //this fetches the name input from the new.ejs file. but how does it know?
  var image =req.body.image;
  var desc= req.body.description;
  var price =req.body.price;
  var author={
      id: req.user._id,
      username: req.user.username
  }

  
  var newCampground= {name: name, image: image, description: desc, author: author, price: price}; //u passed in these variables from above.
 // console.log(req.user);prints user data using passport
  
  // create  new campground and push to db
  Camp.create(newCampground, function(err, newlyCreated){
      if (err){
          console.log(err);
      } else {
           //newlycreated is what ur calling the camp in the function above
         console.log(newlyCreated);
          res.redirect("/campgrounds");
      }
  });

}); //even tho this route has the same name and url as the above it's not the same

//SHOW-shows more info abt 1 campground
//-------------------------------------
router.get("/campgrounds/:id", function(req, res){ //remember that id can be anything
//find the campground with provided ID
Camp.findById(req.params.id).populate("comments").exec(function (err, foundCampground){
  if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("back");
  }  else {
//to show template  
     console.log(foundCampground);
      res.render("campgrounds/show.ejs", {campground: foundCampground}); //this turns  foundCampground to campground
  }
});
});

//EDIT CAMPGROUND ROUTE
//---------------------
router.get("/campgrounds/:id/edit", middleware1.checkOwnership, function(req, res) { //u have middleware running
    Camp.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit.ejs",{campground2: foundCampground}); //campground2 is foundcampground above but in the edit file!
    });
});


//UPDATE CAMPGROUND ROUTE
//-----------------------
router.put("/campgrounds/:id", middleware1.checkOwnership, function(req, res){
   //find and update correct cmpground
   Camp.findByIdAndUpdate(req.params.id, req.body.camp1, function(err, updatedCampground){
      if (err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/"+req.params.id);
      }
   });//it gets the id from the url. the second param is the data u want to update
   //camp1 is coming from the body of the edit form
   //redirect to show page
});


//DESTROY CAMPGROUND ROUTE
//------------------------
router.delete("/campgrounds/:id",middleware1.checkOwnership, function(req,res){
  Camp.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
  });
});







module.exports=router;
