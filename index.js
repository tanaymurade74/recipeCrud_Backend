const mongoose = require("mongoose")
const express = require("express")

const app = express();

const {initializeDatabase} = require("./db/db.connect")
const Recipe = require("./models/recipe.models");
app.use(express.json());

initializeDatabase();

async function createRecipe(recipe){
    try{    
        const newRecipe = new Recipe(recipe);
        const saveRecipe = newRecipe.save();
        return saveRecipe;
    }catch(error){
        throw error
    }
}

async function getAllRecipes(){
    try{
        const recipes = await Recipe.find();
        return recipes;
    }catch{
        throw error;
    }
}

async function getByTitle(title){
    try{
        const recipe = await Recipe.find({title: title})
        return recipe;
    }catch(error){
        throw error;
    }
}

async function getByAuthor(author){
    try{
        const recipes = await Recipe.find({author: author})
        return recipes;
    }catch(error){
        throw error;
    }
}

async function getByDifficulty(difficulty){
    try{
        const recipes = await Recipe.find({difficulty: difficulty})
        return recipes;
    }catch(error){
        throw error;
    }
}

async function updateById(id, dataToUpate){
    try{
        const updatedData = await Recipe.findByIdAndUpdate(id, dataToUpate, {new: true});
        return updatedData;
    }catch(error){
        throw error;
    }
}

async function updateByTitle(title, dataToUpate){
    try{
        const updatedData = await Recipe.findOneAndUpdate({title: title}, dataToUpate, {new: true});
        return updatedData;
    }catch(error){
        throw error;
    }
}

async function deleteById(id){
    try{
        const recipe = await Recipe.findByIdAndDelete(id);
        return recipe;
    }catch(error){
        throw error;
    }
}

app.post("/recipe", async (req, res)=>{
    try{
        const newRecipe = req.body;
        if(!newRecipe.title || !newRecipe.author || !newRecipe.prepTime || !newRecipe.cookTime || !newRecipe.ingredients || !newRecipe.instructions || !newRecipe.imageUrl){
            res.status(400).json({error: "Mandatory fields are missing"})
        }
        const recipe = await createRecipe(req.body);
        res.status(200).json({message: "Recipe has been created", recipe: recipe})
    }catch{
        res.status(500).json({error: "Failed to add the recipe"})
    }
})


app.get("/recipe", async (req, res)=>{
    try{
        const recipes = await getAllRecipes();
        if(!recipes){
            res.status(404).json({error: "Recipes not found"})
        }else{
            res.status(200).json(recipes)
        }
    }catch{
        res.status(500).json({error: "Failed to get the recipes"})
    }
})

app.get("/recipe/title/:title", async (req, res)=>{
    try{
        const recipe = await getByTitle(req.params.title);
        if(!recipe){
            res.status(404).json({error: "Recipe not found"})
        }else{
            res.status(200).json(recipe);
        }
    }catch{
        res.status(500).json({error: "Filed to get by title"})
    }
})

app.get("/recipe/author/:author", async (req, res)=>{
    try{
        const recipes = await getByAuthor(req.params.author)
        if(!recipes){
            res.status(404).json({error: "Recipe not found"})
        }else{
            res.status(200).json(recipes);
        }
    }catch{
        res.status(500).json({error: "Failed to get by author"})
    }
})

app.get("/recipe/difficulty/:difficulty", async (req, res)=>{
    try{    
        const recipes = await getByDifficulty(req.params.difficulty)
        if(!recipes){
            res.status(404).json({error: "Recipes not found"})
        }else{
            res.status(200).json(recipes);
        }
    }catch{
        res.status(500).json({error: "Failed to get by difficulty"})
    }
})

app.post("/recipe/:recipeId", async (req, res)=>{
    try{
        const updatedRecipe = await updateById(req.params.recipeId, req.body);
        if(!updatedRecipe){
            res.status(404).json({error: "Recipe not found"})
        }else{
            res.status(200).json({message: "Recipe has been updated", recipe: updatedRecipe})
        }
    }catch{
        res.status(500).json({error: "Failed to update by id"})
    }
})

app.post("/recipe/title/:title", async (req, res)=>{
    try{
        const updatedRecipe = await updateByTitle(req.params.title, req.body);
        if(!updatedRecipe){
            res.status(404).json({error: "Recipe not found"})
        }else{
            res.status(200).json({message: "Recipe has been updated", recipe: updatedRecipe})
        }
    }catch{
        res.status(500).json({error: "Failed to update by title"})
    }
})

app.delete("/recipe/:recipeId", async (req, res)=>{
    try{
        const deletedRecipe = await deleteById(req.params.recipeId);
        if(!deletedRecipe){
            res.status(404).json({error: "Recipe not found"})
        }else{
            res.status(200).json({message: "Recipe has been deleted", recipe: deletedRecipe })
        }
    }catch{
        res.status(500).json({error: "Failed to delete"})
    }
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server running on port 3000")
})

