import React, { useReducer, useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import SearchBar from "./Components/SearchBar";
import AllRecipes from "./Components/AllRecipes/AllRecipes";
import Recipe from "./Components/Recipe/Recipe";
import CreateRecipeForm from "./Components/CreateRecipeForm/CreateRecipeForm";
import EditRecipe from "./Components/EditRecipe/EditRecipe";
import DeleteRecipe from "./Components/DeleteRecipe/DeleteRecipe";
import LoginForm from "./Components/LoginForm/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import Logout from "./Components/Logout/Logout";  // Import Logout component
import Rsz_12eating_friends from "./rsz_12eating_friends.png";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_RECIPES":
      return {
        ...state,
        recipes: action.payload,
        filteredRecipes: action.payload,
      };
    case "SEARCH":
      const searchTerm = action.payload.toLowerCase();
      const filteredRecipes = state.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm)
      );
      return { ...state, filteredRecipes };
    default:
      return state;
  }
};

const initialState = {
  recipes: [],
  filteredRecipes: [],
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);  // Add loggingOut state

  const connect = async () => {
    const response = await fetch("http://localhost:3000/all-recipes");
    const resultRecipes = await response.json();
    dispatch({ type: "SET_RECIPES", payload: resultRecipes });
  };

  useEffect(() => {
    connect();
  }, []);

  const handleSearch = (searchTerm) => {
    dispatch({ type: "SEARCH", payload: searchTerm });
    setSearchTerm(searchTerm);
  };

  const handleLogout = () => {
    setLoggingOut(true);
  };
  
  return (
    <div className="App">
     
      <NavBar handleLogout={handleLogout} />  {/* Pass handleLogout to NavBar */}
      <div>
        <Routes>
          <Route
            path="/main"
            element={
              <>
                <h1>Recipe Finder App</h1>
                <br />
                <img
                  className="eating"
                  src={Rsz_12eating_friends}
                  alt="friends-img"
                />
                <SearchBar onSearch={handleSearch} />
                {searchTerm !== "" && state.filteredRecipes.length === 0 && (
                  <p>No recipes found. Try searching for something else.</p>
                )}
                {searchTerm !== "" &&
                  state.filteredRecipes.map((recipe) => (
                    <Recipe key={recipe._id} recipe={recipe} />
                  ))}
              </>
            }
          />
          <Route path="/all-recipes" element={<AllRecipes />} />
          <Route path="/edit-recipe" element={<EditRecipe />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/create-recipe" element={<CreateRecipeForm />} />
          <Route path="/delete-recipe" element={<DeleteRecipe />} />
          <Route path="/logout" element={<Logout />} />  {/* Render Logout component */}
        </Routes>
      </div>
    </div>
  );
};

export default App;

