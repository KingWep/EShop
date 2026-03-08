import { createContext, useContext, useEffect, useState } from "react";
import { getProducts, getActiveProducts } from "../services/admin/adminProductService";
import { getCategoriesAdmin } from "../services/admin/adminCategoryService";
const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const resProducts = await getProducts();
        setProducts(resProducts.content || []);
        setTotalProducts(resProducts.totalElements || 0);

        const resActive = await getActiveProducts();
        console.log("Active Products Response:", resActive);
        setActiveProducts(resActive.content || []);

        const resCategories = await getCategoriesAdmin();
        setTotalCategory(resCategories.totalElements || 0);
        console.log("Total Categories:", resCategories.totalElements);
      } catch (err) {
        console.error("ProductsContext fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        activeProducts,
        totalProducts,
        totalCategory,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook to use products context
export const useProducts = () => useContext(ProductsContext);