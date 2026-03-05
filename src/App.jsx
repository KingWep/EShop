
// import { BrowserRouter } from "react-router-dom";
// import { AppProvider } from "./context/AppContext";
// import AppRouters from "./routes/AppRouters"; 
// import ScrollToTop from "./components/ScrollToTop";

// export default function App() {
//     return (
//         <AppProvider>
//             <BrowserRouter>
//                 <ScrollToTop/>
//                 <AppRouters/>
//             </BrowserRouter>
//         </AppProvider>
//     )
// }


import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ProductsProvider } from "./context/ProductsContext.jsx"; // 👈 updated
import AppRouters from "./routes/AppRouters"; 
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
    return (
        <AppProvider>
            <ProductsProvider>
                <BrowserRouter>
                    <ScrollToTop/>
                    <AppRouters/>
                </BrowserRouter>
            </ProductsProvider>
        </AppProvider>
    )
}