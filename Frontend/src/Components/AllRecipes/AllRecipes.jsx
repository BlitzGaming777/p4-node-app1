import React, { useState, useEffect } from "react";
import Recipe from "../Recipe/Recipe";

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isEdited, setIsEdited] = useState(false); // Add isEdited as a state variable

  useEffect(() => {
    // Fetch the updated data from the server and update the state
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:3000/all-recipes");
        const resultRecipes = await response.json();
        console.log("Fetched Recipes:", resultRecipes); // Log fetched recipes
        setRecipes(resultRecipes);
      } catch (error) {
        console.log("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [isEdited]);

  console.log("isEdited:", isEdited); // Log the value of isEdited

  return (
    <div>
      <h2>All Recipes</h2>
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default AllRecipes;

