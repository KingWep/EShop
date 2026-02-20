import React, { useEffect, useState } from "react";

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [adding, setAdding] = useState(false);

  const API_URL = "https://e-shop-1-m034.onrender.com/api/v1/products";

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Failed to fetch. Status: ${response.status}`);

      const data = await response.json();
      setProducts(data.content || []);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    setAdding(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
        }),
      });

      if (!response.ok) throw new Error(`Failed to add product. Status: ${response.status}`);
      await response.json();
      setNewProduct({ name: "", price: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error adding product: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#1a1a2e", minHeight: "100vh", color: "#fff", padding: "30px" }}>
      <h1 style={{ color: "#9b5de5", marginBottom: "20px" }}>Inventory Management</h1>

      {/* Add Product Form */}
      <div style={{ marginBottom: "30px", backgroundColor: "#162447", padding: "20px", borderRadius: "12px" }}>
        <h2 style={{ color: "#f15bb5" }}>Add New Product</h2>
        <form onSubmit={handleAddProduct} style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            required
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            style={{
              flex: "1",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
            }}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            required
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{
              width: "120px",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={adding}
            style={{
              backgroundColor: "#9b5de5",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {adding ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* Product List */}
      <h2 style={{ color: "#f15bb5", marginBottom: "15px" }}>Product List</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product._id || product.id}
              style={{
                backgroundColor: "#162447",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ color: "#f15bb5", marginBottom: "10px" }}>{product.name}</h3>
              <p style={{ fontSize: "16px" }}>Price: ${product.price ?? "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
