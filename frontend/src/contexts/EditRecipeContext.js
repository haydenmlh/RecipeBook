import { createContext, useState } from "react";

export const useEditRecipeContext = () => {
  const [cuisine, setCuisine] = useState("");
  const [name, setName] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [recipeId, setRecipeId] = useState(0);
  const [numFavorites, setNumFavorites] = useState(0);  // this is hearts
  const [numLikes, setNumLikes] = useState(0); // this is bookmarks
  const [baseRecipeId, setBaseRecipeId] = useState(-1)
  const [baseRecipeName, setBaseRecipeName] = useState("")
  const [recipeImages, setRecipeImages] = useState([])
  const [diets, setDiets] = useState([]);
  const [ingredients, setIngredients] = useState([])
  const [servings, setServings] = useState([])
  const [prepSteps, setPrepSteps] = useState([])
  const [cookSteps, setCookSteps] = useState([])
  


  return {
    recipeId,
    setRecipeId,
    cuisine,
    setCuisine,
    name,
    setName,
    avgRating,
    setAvgRating,
    numRatings, 
    setNumRatings,
    numFavorites,
    setNumFavorites,
    numLikes,
    setNumLikes,
    baseRecipeId, setBaseRecipeId,
    baseRecipeName, setBaseRecipeName,
    recipeImages, setRecipeImages,
    diets, setDiets,
    ingredients, setIngredients,
    servings, setServings,
    prepSteps, setPrepSteps,
    cookSteps, setCookSteps,
  };
} 

const EditRecipeContext = createContext({
  recipeId: null,
  setRecipeId: () => {},
  cuisine: null,
  setCuisine: () => {},
  name: null,
  setName: () => {},
  avgRating: null,
  setAvgRating: () => {},
  numRatings: null, 
  setNumRatings: () => {},
  numFavorites: null,
  setNumFavorites: () => {},
  numLikes: null,
  setNumLikes: () => {},
  baseRecipeId: null, setBaseRecipeId: () => {},
  baseRecipeName: null, setBaseRecipeName: () => {},
  recipeImages: null, setRecipeImages: () => {},
  diets: null, setDiets: () => {},
  ingredients: null, setIngredients: () => {},
  servings: null, setServings: () => {},
  prepSteps: null, setPrepSteps: () => {},
  cookSteps: null, setCookSteps: () => {},
})

export default EditRecipeContext;