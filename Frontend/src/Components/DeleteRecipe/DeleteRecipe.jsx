import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteRecipe = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false); // New state to track search button click
  const navigate = useNavigate();

  const handleSearch = async () => {
    // Check if the search term is empty
    if (!searchTerm) {
      setSearchResult([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/recipes?title=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error("Error searching for recipes:", error);
      setSearchResult([]);
    }
    setSearchClicked(true); // Set the state to true when the search button is clicked
  };

  const handleDelete = async (recipeId, recipeTitle) => {
    try {
      console.log("Deleting Recipe...");
      setDeletePopup(true);
      const response = await fetch(`http://localhost:3000/recipe/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (response.ok) {
        setSuccessPopup(true);
        
        setTimeout(() => {
          setDeletePopup(false);
          setSuccessPopup(false);
          setSearchResult(searchResult.filter((recipe) => recipe._id !== recipeId));
          setSearchTerm(""); // Clear the search input bar
        }, 3000);
      } else {
        throw new Error("Delete request failed");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setDeletePopup(false);
      setSuccessPopup(false);
    }
  };

  return (
    <div>
      <h2>Delete Recipe</h2>
      <input
        type="text"
        placeholder="Search for a recipe..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="delete-btn" onClick={handleSearch}>Search</button>
           
      {searchClicked && searchTerm && searchResult.length === 0 && (
        <div className="popup-message">No recipe found. Try another recipe.</div>
      )}

      {searchResult.map((recipe) => (
        <div key={recipe._id}>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          <button onClick={() => handleDelete(recipe._id, recipe.title)}>Delete</button>
        </div>
      ))}

      {deletePopup && <div className="popup-message delete-popup">Deleting Recipe...</div>}
      {successPopup && <div className="popup-message success-popup">Recipe successfully deleted!</div>}
    </div>
  );
};

export default DeleteRecipe;

