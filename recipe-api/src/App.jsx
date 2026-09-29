import { useEffect, useState } from "react";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.recipes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Recipe Details</h1>

      {loading ? (
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
          }}
          border="1"
        >
          <thead>
            <tr style={{ backgroundColor: "#2563eb", color: "white" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Image</th>
              <th style={{ padding: "12px" }}>Instructions</th>
              <th style={{ padding: "12px" }}>Ingredients</th>
            </tr>
          </thead>

          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                {/* ID */}
                <td style={{ padding: "15px", verticalAlign: "top" }}>
                  {recipe.id}
                </td>

                {/* Name */}
                <td
                  style={{
                    padding: "15px",
                    verticalAlign: "top",
                    fontWeight: "bold",
                  }}
                >
                  {recipe.name}
                </td>

                {/* Image */}
                <td style={{ padding: "15px", verticalAlign: "top" }}>
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    width="130"
                    style={{ borderRadius: "8px" }}
                  />
                </td>

                {/* Instructions */}
                <td style={{ padding: "15px", verticalAlign: "top" }}>
                  <ol>
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} style={{ marginBottom: "6px" }}>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </td>

                {/* Ingredients */}
                <td style={{ padding: "15px", verticalAlign: "top" }}>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} style={{ marginBottom: "6px" }}>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;