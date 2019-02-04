var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var middleware = require("../middleware");

// Define escapeRegex function for search feature
// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// }

//INDEX - show all the recipes
router.get("/", function(req, res){
    // Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
       if(err){
           console.log(err);
       } else {
          res.render("recipes/index",{recipes:allRecipes});
       }
    });
});

//CREATE - add new recipe to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from FORM and add to recipes ARRAY
    var title = req.body.title;
    var image = req.body.image;
    var difficulty = req.body.difficulty;
    var prep = req.body.preparation;
    var cooking= req.body.cooking;
    var portion = req.body.portion;
    var cost = req.body.cost;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newRecipe = {title: title, image: image, difficulty:difficulty, preparation:prep, cooking:cooking, portion: portion, cost:cost, description: desc, author: author};
    //Create a new recipe and save to DB
   Recipe.create(newRecipe, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
          //redirect back to recipes page
          console.log(newlyCreated);
          res.redirect("/recipes");
       }
   });
  });

//NEW - show form to create new recipe
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("recipes/new");
}); 

//SHOW - shows more info about one recipe
router.get("/:id", function(req, res){
    //find the recipe with provided ID
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
        if(err){
            console.log(err);
            req.flash('error', 'Sorry, that recipe does not exist!');
            return res.redirect('/recipes');
        }else{
            console.log(foundRecipe);
            //render show template with that recipe
            res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});

//EDIT - shows edit form for one recipe
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
         if(err){
            res.redirect("/recipes");
        } else {
          res.render("recipes/edit", {recipe: foundRecipe});   
          }
     });
});


//UPDATE - Updates particular recipe, then redirects somewhere 
router.put("/:id", middleware.checkRecipeOwnership, function(req, res){
        //  var newData = {
        //      title: req.body.title, image: req.body.image, difficulty: req.body.difficulty, prep: req.body.preparation, cooking: req.body.cooking, portion: req.body.portion, cost: req.body.cost, description: req.body.description};
        
    //find and update the correct recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, recipe){
        if(err){
            req.flash("error", err.message);
            res.redirect("/recipes");
        } else {
            //redirect somewhere(show page)
            req.flash("success","Successfully Updated!");
            res.redirect("/recipes/" + recipe._id);
        }
    });
});

//DESTROY - Delete a particular recipe, then redirect somewhere
router.delete("/:id", middleware.checkRecipeOwnership, function(req, res){
    
    Recipe.findByIdAndRemove(req.params.id, function(err){
      if(err){
          req.flash('error', err.message);
          res.redirect("/recipes");
      } else {
          res.redirect("/recipes");
      }
   });
});

//   Comment.remove({
//       _id: {
//         $in: req.recipe.comments
//       }
//     }, function(err) {
//       if(err) {
//           req.flash('error', err.message);
//           res.redirect('/');
//       } else {
//           req.recipe.remove(function(err) {
//             if(err) {
//                 req.flash('error', err.message);
//                 return res.redirect('/');
//             }
//             req.flash('error', 'Recipe deleted!');
//             res.redirect('/recipes');
//           });
//       }
//     });
// });
      
module.exports = router;


//INDEX 
// router.get("/", function(req, res){
//     if(req.query.search && req.xhr) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//     //Get all recipes from DB
//     Recipe.find({name: regex}, function(err, allRecipes){
//       if(err){
//           console.log(err);
//       }else{
//           res.status(200).json(allRecipes);
//          }
//       });
//   } else {
//       // Get all recipes from DB
//       Recipe.find({}, function(err, allRecipes){
//          if(err){
//              console.log(err);
//          } else {
//             if(req.xhr) {
//               res.json(allRecipes);
//             } else {
//               res.render("recipes/index",{recipes: allRecipes, page: 'recipes'});
//             }
//          }
//       });
//   }
// });
