import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [recipe, setRecipe] = useState({
    _id: "",
    image: "",
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    isDeleted: false,
  });
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/recipe/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setRecipe(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  const handleSearch = () => {
    console.log("Search term:", searchTerm);

    fetch(`http://localhost:3000/recipes?title=${searchTerm}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);

        const matchingRecipe = data.find((recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchingRecipe) {
          setRecipe(matchingRecipe);
          setSearchMessage("");
        } else {
          setRecipe({
            _id: "",
            image: "",
            title: "",
            description: "",
            ingredients: [],
            instructions: [],
            isDeleted: false,
          });
          setSearchMessage("No recipe found, please try again");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "title" || name === "description") {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: value,
      }));
    } else {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: value.split(","),
      }));
    }
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    // Preserve the current isDeleted value during the update
    const updatedRecipe = { ...recipe, isDeleted: recipe.isDeleted };

    fetch(`http://localhost:3000/recipe/${recipe._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipe),
    })
      .then(() => {
        setIsEdited(true);

        // Clear the input fields after successful edit
        setRecipe({
          _id: "",
          image: "",
          title: "",
          description: "",
          ingredients: [],
          instructions: [],
          isDeleted: false,
        });

        setSearchTerm(""); // Clear the search input bar

        setTimeout(() => {
          setIsEdited(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h2>Edit Recipe</h2>

      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Recipe Name"
        />
        <button className="edit-btn" onClick={handleSearch}>
          Search
        </button>
        <p>{searchMessage}</p>
      </div>

      <form className="edit-recipe-form">
        <div>
          <input
            className="edit-image-url"
            type="text"
            placeholder="Edit Image URL"
            value={recipe.image}
            onChange={handleChange}
            name="image"
          />
        </div>
        <br></br>
        <div>
          <input
            className="edit-recipe-title"
            type="text"
            placeholder="Edit Recipe Title"
            value={recipe.title}
            onChange={handleChange}
            name="title"
          />
        </div>
        <br></br>
        <div>
          <input
            className="edit-description"
            type="text"
            placeholder="Edit Description"
            value={recipe.description}
            onChange={handleChange}
            name="description"
          />
        </div>
        <br></br>
        <div>
          <input
            className="edit-ingredients"
            type="text"
            placeholder="Edit Ingredients"
            value={recipe.ingredients.join(",")}
            onChange={handleChange}
            name="ingredients"
          />
        </div>
        <br></br>
        <div>
          <input
            className="edit-instructions"
            type="text"
            placeholder="Edit Instructions"
            value={recipe.instructions.join(",")}
            onChange={handleChange}
            name="instructions"
          />
        </div>
      </form>
      <br></br>
      <form onSubmit={handleEditSubmit}>
        <button type="submit">{id ? "Update" : "Submit"}</button>
      </form>

      {isEdited && <p>Recipe Edited Successfully.</p>}
    </div>
  );
};

export default EditRecipe;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const EditRecipe = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchMessage, setSearchMessage] = useState("");
//   const [recipe, setRecipe] = useState({
//     _id: "",
//     image: "",
//     title: "",
//     description: "",
//     ingredients: [],
//     instructions: [],
//     isDeleted: false,
//   });
//   const [isEdited, setIsEdited] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetch(`/recipe/${id}`)
//         .then((response) => response.json())
//         .then((data) => {
//           setRecipe(data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }, [id]);

//   const handleSearch = () => {
//     console.log("Search term:", searchTerm);

//     fetch(`http://localhost:3000/recipes?title=${searchTerm}`, {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Response:", data);

//         const matchingRecipe = data.find((recipe) =>
//           recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//         if (matchingRecipe) {
//           setRecipe(matchingRecipe);
//           setSearchMessage("");
//         } else {
//           setRecipe({
//             _id: "",
//             image: "",
//             title: "",
//             description: "",
//             ingredients: [],
//             instructions: [],
//             isDeleted: false,
//           });
//           setSearchMessage("No recipe found, please try again");
//         }
//       })
//       .catch((error) => {
//         console.log("Error:", error);
//       });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === "title" || name === "description") {
//       setRecipe((prevRecipe) => ({
//         ...prevRecipe,
//         [name]: value,
//       }));
//     } else {
//       setRecipe((prevRecipe) => ({
//         ...prevRecipe,
//         [name]: value.split(","),
//       }));
//     }
//   };

//   const handleEditSubmit = (event) => {
//     event.preventDefault();

//     // Preserve the current isDeleted value during the update
//     const updatedRecipe = { ...recipe, isDeleted: recipe.isDeleted };

//     fetch(`http://localhost:3000/recipe/${recipe._id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedRecipe),
//     })
//       .then(() => {
//         setIsEdited(true);
//         setTimeout(() => {
//           setIsEdited(false);
//         }, 5000);
//       })

//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <div>
//       <h2>Edit Recipe</h2>

//       <div>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Enter Recipe Name"
//         />
//         <button className="edit-btn" onClick={handleSearch}>
//           Search
//         </button>
//         <p>{searchMessage}</p>
//       </div>

//       <form className="edit-recipe-form">
//         <div>
//           <input
//             className="edit-image-url"
//             type="text"
//             placeholder="Edit Image URL"
//             value={recipe.image}
//             onChange={handleChange}
//             name="image"
//           />
//         </div>
//         <br></br>
//         <div>
//           <input
//             className="edit-recipe-title"
//             type="text"
//             placeholder="Edit Recipe Title"
//             value={recipe.title}
//             onChange={handleChange}
//             name="title"
//           />
//         </div>
//         <br></br>
//         <div>
//           <input
//             className="edit-description"
//             type="text"
//             placeholder="Edit Description"
//             value={recipe.description}
//             onChange={handleChange}
//             name="description"
//           />
//         </div>
//         <br></br>
//         <div>
//           <input
//             className="edit-ingredients"
//             type="text"
//             placeholder="Edit Ingredients"
//             value={recipe.ingredients.join(",")}
//             onChange={handleChange}
//             name="ingredients"
//           />
//         </div>
//         <br></br>
//         <div>
//           <input
//             className="edit-instructions"
//             type="text"
//             placeholder="Edit Instructions"
//             value={recipe.instructions.join(",")}
//             onChange={handleChange}
//             name="instructions"
//           />
//         </div>
//       </form>
//       <br></br>
//       <form onSubmit={handleEditSubmit}>
//         <button type="submit">{id ? "Update" : "Submit"}</button>
//       </form>

//       {isEdited && <p>Recipe Edited Successfully.</p>}
//     </div>
//   );
// };

// export default EditRecipe;
