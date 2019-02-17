var express   =require("express"),
    app       =express(),
    bodyParser=require("body-parser"),
    mongoose  =require("mongoose"),
    passport  =require("passport"),
localStrategy =require("passport-local"),
    Comment   =require("./models/comment.js"), //creates comment modelfrom model
    Camp      =require("./models/camp.js"),    //creates camp model from model
    User      =require("./models/user"),       //same thing for user
    seedDB    =require("./seeds"), //gets seed data
    methodOverride =require("method-override"), //u use this for put requests and stuff
    flash = require("connect-flash"); //for flash messages


app.use(flash());
app.use(methodOverride("_method"));    
app.use(express.static(__dirname+"/public")); //this is to serve the css file, public is where ur stylesheets are
//the link to the css file is in the header partial
seedDB(); //this code is kinda sus, refer to the notes

var commentRoutes=require("./routes/comments"), //these are to import the routes from the routes folder
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");



//DATABASES
//---------
//mongoose.connect('mongodb://localhost:27017/yelp_campv12', { useNewUrlParser: true }); //new syntax that came out after Colt's video, makes datbase called yelpcamp12
//mongoose.connect("mongodb+srv://junaiderade:theStudent1998*@cluster0-cgoyr.mongodb.net/test?retryWrites=true"); //mlab link for database!
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true}); //new database url u made in environmental variables video




//you chose not to use the set view engine in this
app.use(bodyParser.urlencoded({extended: true})); //you need this everytime u use bodyparser

//PASSPORT CONFIGURATION
//----------------------
app.use(require("express-session")({
    secret: "bagles are underrated",
    resave: false,
    saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));//user.authenticate comes with passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user; //this makes currentUser available to all routes. 
    res.locals.error=req.flash("error");//gives everything the error message. name of this var is error
    res.locals.success=req.flash("success");
    next();
});

app.use(authRoutes); //to use the variables u required above
app.use(commentRoutes); //means all routes should start with campgrounds
app.use(campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, 
function(){console.log("YelpCamp server has started");} 
);