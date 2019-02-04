var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment = require("./models/comment");

//as we're going to create many recipes(not just one at a time) let's store them in var
var data = [
    {
     title: "Spicy Rice",
     image: "https://images.unsplash.com/photo-1540100716001-4b432820e37f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",       
     difficulty:"average",
     preparation:"10",
     cooking:"30",
     portion:"4",
     cost:"5.00",
     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
     title: "Stuffed Pepper",
     image: "https://images.unsplash.com/photo-1509377244-b9820f59c12f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",       
     difficulty:"average",
     preparation:"15",
     cooking:"20",
     portion:"2",
     cost:"4.50",
     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
     title: "Sunny Salad",
     image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",       
     difficulty:"easy",
     preparation:"5",
     cooking:"0",
     portion:"2",
     cost:"3.00",
     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
];

function seedDB(){ //we want to export a function
    //Remove all recipes
    Recipe.deleteMany({}, function(err){
     if(err){
        console.log(err);
     }
     console.log("removed recipes");
      //Add a few recipes
      data.forEach(function(seed){ //"seed" is gonna represent one of the new recipes
            Recipe.create(seed, function(err, recipe){
    //we're not gonna pass in an OBJ in {curly braces}, we're just passing in SEED
              if(err){
                  console.log(err);
              } else {
                  console.log("added a recipe");
                  //create a comment 
                  Comment.create(
                      {
                          text: "Yummy! Looking forward for new recipes",
                            author: {
                                 id: "588c2e092403d111454fff76",
                                 username: "Jack"
                             }
                      }, function(err, comment){
                         if(err){
                             console.log(err);
                         } else {
                             recipe.comments.push(comment);
                             recipe.save();
                             console.log("created new comment");
                         }
                      });
              }
          });
      });
   });
  
   //Add a few comments
   
} 

module.exports = seedDB;//it will send the function out
//which will be stored in seedDB in app.js