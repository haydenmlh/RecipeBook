import { createContext, useState } from "react";

export const useMyRecipesContext = () => {
    const [recipes, setRecipes] = useState([]);
    const [query, setQuery] = useState({
        search: '', page: 0
    })

    return {
        recipes,
        setRecipes,
        query,
        setQuery,
    }
} 

const MyRecipesContext = createContext({
    recipes: null,
    setRecipes: () => {},
    query: null,
    setQuery: () => {},
})

export default MyRecipesContext;