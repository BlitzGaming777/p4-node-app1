import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRecipeForm = () => {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState({
    image: "",
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
  });
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { image, title, description, ingredients, instructions } = recipeData;
    const newRecipe = {
      image,
      title,
      description,
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
      instructions: instructions
        .split(",")
        .map((instruction) => instruction.trim()),
    };

    try {
      const response = await fetch("http://localhost:3000/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        setRecipeData({
          image: "",
          title: "",
          description: "",
          ingredients: "",
          instructions: "",
        });
        // Show the alert with the recipe title
        setAlertMessage(`${title} recipe created successfully`);

        // Redirect to Recipe Finder main page after 3 seconds
        setTimeout(() => {
          navigate("/main"); 
        }, 3000);
      } else {
        throw new Error("Error creating recipe");
      }
    } catch (error) {
      console.log(error);
      // Display error message
    }
  };

  return (
    <div>
      <h2>Create Recipe</h2>
      
      {alertMessage && <p>{alertMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Image URL"
            id="image"
            name="image"
            value={recipeData.image}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <input
            type="text"
            placeholder="Title"
            id="title"
            name="title"
            value={recipeData.title}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <input
            type="text"
            placeholder="Description"
            id="description"
            name="description"
            value={recipeData.description}
            onChange={handleChange}
          ></input>
        </div>
        <br />
        <div>
          <input
            type="text"
            placeholder="Ingredients"
            id="ingredients"
            name="ingredients"
            value={recipeData.ingredients}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <input
            type="text"
            placeholder="Instructions"
            id="instructions"
            name="instructions"
            value={recipeData.instructions}
            onChange={handleChange}
          ></input>
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateRecipeForm;

