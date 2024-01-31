import './App.css';
import Navbar from './components/Navbar';
import SignUpForm from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import EditPage from "./components/EditPage";
import CreateRecipePage from "./components/CreateRecipePage"
import LogoutPage from './components/LogoutPage';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter , Route, Routes} from 'react-router-dom';
import Homepage from './pages/Homepage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import RecipeEdit from './pages/RecipeEdit';
import ShoppingList from './pages/ShoppingListPage';
import MyRecipes from './pages/MyRecipes'
import MyLikes from './pages/MyLikesPage';
import UserContext, { useUserContext } from './contexts/userContext';
import MyRecipesContext, {useMyRecipesContext} from './contexts/MyRecipesContext.js';
import SearchPage from './pages/SearchPage';
import MyComments from './pages/MyCommentsPage';
import MyRatings from './pages/MyRatings';

function App() {


  return (
    <UserContext.Provider value={useUserContext()}>
      <MyRecipesContext.Provider value={useMyRecipesContext()}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navbar />}>
                <Route index element={<Homepage />} />
                <Route path="signup" element={<SignUpForm />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="edit" element={<EditPage />} />
                <Route path="logout" element={<LogoutPage />} />
                <Route path="recipe-details" element={<RecipeDetailsPage />} />
                <Route path="recipe-edit" element={<RecipeEdit />} />
                <Route path="shopping-list" element={<ShoppingList />} />
                <Route path="create-recipe" element={<CreateRecipePage cuisine={"french"} />} />
                <Route path="my-recipes" element={<MyRecipes />} />
                <Route path="my-fav-recipes" element={<MyLikes />} />
                <Route path="my-com-recipes" element={<MyComments />} />
                <Route path="my-rate-recipes" element={<MyRatings />} />
                <Route path="search" element={<SearchPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
      </MyRecipesContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
