var express          = require("express"),
    app              = express(),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    cookieParser     = require("cookie-parser"),
    LocalStrategy    = require("passport-local"),
    flash            = require("connect-flash"),   
    methodOverride   = require("method-override"),
    Recipe           = require("./models/recipe"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    session          = require("express-session"),
    seedDB           = require("./seeds"); //how to run seeds file; same dir as app.js


// requiring routes
var commentRoutes    = require("./routes/comments"),
    recipeRoutes = require("./routes/recipes"),
    indexRoutes      = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/recipes";
//console.log(process.env.DATABASEURL);

//APP CONFIG
mongoose.connect(url, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment')

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Recipe.create({
//       title: "Pasta al pomodoro",
//       image: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bb8f920efd9334f4237e960bedd9dde7&auto=format&fit=crop&w=334&q=80",
//       difficulty:"easy",
//       preparation: "10",
//       cooking: "20",
//       portion:"3",
//       body: "Salsify taro catsear garlic gram celery bitterleaf wattle seed kombu beetroot horseradish carrot squash brussels sprout chard. Kombu beetroot horseradish carrot squash brussels sprout chard."
//   });


// use of express router
app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("RECIPES' server is working");
});