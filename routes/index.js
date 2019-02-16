var express=require ("express");
var Camp= require("../models/camp");
var Comment=require("../models/comment");
var passport=require("passport");
var User=require("../models/user");
var router =express.Router();







//ROOT ROUTE
//----------
router.get("/", function(req, res){ 
res.render("landingPage.ejs");
});


//SHOW REGISTER FORM
//------------------
router.get("/register", function(req, res){
    res.render("register.ejs");
});

//HANDLE SIGNUP LOGIC
//-------------------
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});//req.body comes from register.ejs
    User.register(newUser, req.body.password, function (err, user){
        if(err){
        return res.render("register.ejs", {"error": err.message}); //u use return cuz its a nice way to short circuit and get out of the whole callback
        //slight error here u had t refer to a note
        }
        passport.authenticate("local")(req, res, function(){ //once a user has signed up this logs them in
            req.flash("success", "Welcome "+user.username);
            res.redirect("/campgrounds"); //takes u to /campgrounds if everything went well
        });//local is the type of strategy
    }); //this register methdo takes the user and password as parameters
});

//SHOW LOGIN FORM
//---------------
router.get("/login", function(req, res){
    res.render("login.ejs");//this is the req.flash u called errorin ur middleware, also connected to login.ejs
    //res.locals.loginMessage=req.flash("error"); //error comes from middleware. loginMessage is the name of this var and it's available to every file!
});

//HANDLING LOGIN LOGIC
//--------------------
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "login"
}));//colt had another function here, but that did nothing, he had it there to show u this is middleware

//LOGOUT ROUTE
//------------
router.get("/logout", function(req, res){
  req.logout(); //it's as easy as this to log somebody out
  req.flash("success", "Logged You Out!")
  res.redirect("/campgrounds");
});



module.exports = router; 