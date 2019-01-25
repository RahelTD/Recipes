var mongoose = require("mongoose");

//SCHEMA SETUP 
var recipeSchema = new mongoose.Schema({
    title: String,
    image: String,
    difficulty: String,      
    preparation: String,
    cooking: String,
    portion: String,
    cost: Number,
    description: String, //instead of "body"
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
     ]
});

module.exports = mongoose.model("Recipe", recipeSchema);
