var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function(req, res){
   res.render("landing"); 
});

// AUTH show register form 
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// AUTH handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
     if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/recipes");
        });
    });
});

// AUTH show login form 
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

// AUTH handling login logic 
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/recipes",
        failureRedirect: "/login",
         failureFlash: true,
        successFlash: 'Welcome to Tea Leaves!'
    }), function(req, res){
});

// AUTH logout logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/recipes");
});

module.exports = router;