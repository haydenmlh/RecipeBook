import { createContext, useState } from "react";

export const usePopularRecipesContext = () => {
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

const PopularRecipesContext = createContext({
    recipes: null,
    setRecipes: () => {},
    query: null,
    setQuery: () => {},
})

export default PopularRecipesContext;