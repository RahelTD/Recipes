var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
var middleware = require("../middleware");
const { isLoggedIn, checkUserComment, isAdmin } = middleware;

// COMMENTS NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
    // find recipe by id and send that through as we render
    console.log(req.params.id);
    Recipe.findById(req.params.id, function(err, recipe){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {recipe: recipe});
        }
    });
});
 
// COMMENTS CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
    //lookup recipe using ID 
    Recipe.findById(req.params.id, function(err, recipe){
         if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/recipes");
        } else {
             //create new comment 
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    //connnect new comment to recipe
                    recipe.comments.push(comment);
                    recipe.save();
                    console.log(comment);
                    // before redirecting, if successfully added a comment
                    req.flash("success", "Successfully added comment");
                     //redirect recipe show page
                    res.redirect('/recipes/' + recipe._id);
                }
            }
        )}
    });
});


// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", isLoggedIn, checkUserComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
           res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment}); 
        }   
    });
});

// COMMENTS UPDATE ROUTE
router.put("/:comment_id", isAdmin, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
           console.log(err);
           res.render("edit");
        } else {
            res.redirect("/recipes/" + req.params.id);
        }
    });
});

// COMMENTS DESTROY ROUTE 
router.delete("/:comment_id", isLoggedIn, checkUserComment, function(req, res){
   // find campground, remove comment from comments array, delete comment in db
 //findByIdAndRemove 
//   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       
Recipe.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    }
  }, function(err) {
    if(err){ 
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/');
    } else {
        req.comment.remove(function(err) {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
          }
          req.flash('error', 'Comment deleted!');
          res.redirect("/recipes/" + req.params.id);
        });
    }
  });
});

module.exports = router;