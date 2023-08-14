import React, { useState } from "react";
import { Link } from "react-router-dom";
import './NavBar.css'

const NavBar = ({ handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/main">Recipe Finder</Link>
      </div>
      <div className={`menu-items ${isMenuOpen ? "open" : ""}`}>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`} />
          <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`} />
          <div className={`hamburger-line ${isMenuOpen ? "open" : ""}`} />
        </div>
        {isMenuOpen && (
          <ul>
            <li>
              <Link to="/all-recipes">All Recipes</Link>
            </li>
            <li>
              <Link to="/create-recipe">Create Recipe</Link>
            </li>
            <li>
              <Link to="/edit-recipe">Edit Recipe</Link>
            </li>
            <li>
              <Link to="/delete-recipe">Delete Recipe</Link>
            </li>
            <li>
              <Link to="/logout" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;




// import React from "react";
// import { Link } from "react-router-dom";



// const NavBar = ({ handleLogout }) => {
//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <Link to="/main">Recipe Finder</Link>
//       </div>
//       <div className="menu-items">
//         <ul>
//           <li>
//             <Link to="/all-recipes">All Recipes</Link>
//           </li>
//           <li>
//             <Link to="/create-recipe">Create Recipe</Link>
//           </li>
//           <li>
//             <Link to="/edit-recipe">Edit Recipe</Link>
//           </li>
//           <li>
//             <Link to="/delete-recipe">Delete Recipe</Link>
//           </li>
//           <li>
//             <Link to="/logout" onClick={handleLogout}>Logout</Link>  {/* Call handleLogout on click */}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

