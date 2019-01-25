var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
express        = require("express"),
mongoose       = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
app            = express();


var url = process.env.DATABASEURL || "mongodb://localhost:27017/recipes";
//console.log(process.env.DATABASEURL);

//APP CONFIG
mongoose.connect(url, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


// Recipe.create({
//       title: "Pasta al pomodoro",
//       image: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bb8f920efd9334f4237e960bedd9dde7&auto=format&fit=crop&w=334&q=80",
//       difficulty:"easy",
//       preparation: "10",
//       cooking: "20",
//       portion:"3",
//       body: "Salsify taro catsear garlic gram celery bitterleaf wattle seed kombu beetroot horseradish carrot squash brussels sprout chard. Kombu beetroot horseradish carrot squash brussels sprout chard."
//   });


//RESTful ROUTES
app.get("/", function(req, res){
   res.redirect("/recipes"); 
});

//INDEX ROUTE
app.get("/recipes", function(req,res){
    Recipe.find({}, function(err, recipes){
        if(err){
            console.log("MADE A MISTAKE");
        } else {
            res.render("index", {recipes: recipes});
        }
    });
});

//NEW ROUTE
app.get("/recipes/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/recipes", function(req, res){
   req.body.recipe.body = req.sanitize(req.body.recipe.body)
   Recipe.create(req.body.recipe, function(err, newRecipe){
       if(err){
           res.render("new");
       } else {
           res.redirect("/recipes");
       }
   }); 
});

//SHOW ROUTE
app.get("/recipes/:id", function(req, res){
   Recipe.findById(req.params.id, function(err, foundRecipe){
      if(err){
          res.redirect("/recipes");
      } else {
          res.render("show", {recipe: foundRecipe})
      }
   }); 
});

//EDIT ROUTE 
app.get("/recipes/:id/edit", function(req, res){
   Recipe.findById(req.params.id, function(err, foundRecipe){
      if(err){
          res.redirect("/recipes");
      } else {
          res.render("edit", {recipe: foundRecipe});
      }
   }); 
});

//UPDATE ROUTE
app.put("/recipes/:id", function(req, res){
    req.body.recipe.body = req.sanitize(req.body.recipe.body)
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
       if(err){
           res.redirect("/recipes");
       } else {
           res.redirect("/recipes/" + req.params.id);
       }
    });
});

//DESTROY
app.delete("/recipes/:id", function(req, res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
           res.redirect("/recipes");
        } else {
           res.redirect("/recipes"); 
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("RECIPES' SERVER IS WORKING")
});