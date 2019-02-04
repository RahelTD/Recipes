var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            if(err){
              req.flash("error", ">Recipe not found");
              res.redirect("back");
            } else {
                // does user own the recipe?
                if(foundRecipe.author.id.equals(req.user._id)){ //first is Mongoose OBJ second is STRING (cannot do === so use a method equals()
                  next();
                } else {
                    // otherwise,
                    req.flash("error", "You don't have permission to do that");
                    // then redirect
                    res.redirect("back");
                }
            } 
        });
    } else {
        // if not,
        req.flash("error", "You need to be logged in to do that!");
        //then redirect
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
              res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){ 
                    //first is Mongoose OBJ second is STRING (cannot do === so use a method equals()
                  next();
                } else {
                    // otherwise, 
                    req.flash("error", "You don't have permission to do that!");
                    // then redirect
                    res.redirect("back");
                }
            } 
        });
    } else {
        // if not, 
        req.flash("error", "You need to be logged in to do that!");
        // then redirect
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;
 
// module.exports = {
//   isLoggedIn: function(req, res, next){
//       if(req.isAuthenticated()){
//           return next();
//       }
//       req.flash('error', 'You must be signed in to do that!');
//       res.redirect('/login');
//   },
//   checkUserRecipe: function(req, res, next){
//     Recipe.findById(req.params.id, function(err, foundRecipe){
//       if(err || !foundRecipe){
//           console.log(err);
//           req.flash('error', 'Sorry, that recipe does not exist!');
//           res.redirect('/recipes');
//       } else if(foundRecipe.author.id.equals(req.user._id) || req.user.isAdmin){
//           req.recipe = foundRecipe;
//           next();
//       } else {
//           req.flash('error', 'You don\'t have permission to do that!');
//           res.redirect('/recipes/' + req.params.id);
//       }
//     });
//   },
//   checkUserComment: function(req, res, next){
//     Comment.findById(req.params.commentId, function(err, foundComment){
//       if(err || !foundComment){
//           console.log(err);
//           req.flash('error', 'Sorry, that comment does not exist!');
//           res.redirect('/recipes');
//       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
//             req.comment = foundComment;
//             next();
//       } else {
//           req.flash('error', 'You don\'t have permission to do that!');
//           res.redirect('/recipes/' + req.params.id);
//       }
//     });
//   },
//   isAdmin: function(req, res, next) {
//     if(req.user.isAdmin) {
//       next();
//     } else {
//       req.flash('error', 'This site is now read only thanks to spam and trolls.');
//       res.redirect('back');
//     }
//   },
//   isSafe: function(req, res, next) {
//     if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
//       next();
//     }else {
//       req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
//       res.redirect('back');
//     }
//   }
// };
