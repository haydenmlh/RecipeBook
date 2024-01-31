import './style.css';
import Search from '../../components/Search';
import PopularRecipes from '../../components/PopularRecipes';
import PopularRecipesContext, { usePopularRecipesContext } from '../../contexts/PopularRecipesContext';

const Homepage = () => {
  return (
      <>
        <Search />
        <div style={{paddingBottom: "25px"}}></div>
        <div class="d-flex justify-content-center">
          <div style={{width: "min(100%, 1400px)"}} >
            <h1>Popular Recipes</h1>
            <PopularRecipesContext.Provider value={usePopularRecipesContext()}>
              <PopularRecipes />
            </PopularRecipesContext.Provider>
          </div>
        </div>
      </>
    )
}

export default Homepage;