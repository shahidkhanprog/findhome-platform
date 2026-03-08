// import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
// import Home from "./pages/Home/Home";
// import About from "./pages/About/About";
// import Contact from "./pages/Contact/Contact";
// import List from "./pages/List/List";
// import AppLayout from "./components/layout/AppLayout";

// function AppRouter() {

//   // Define the routes for the application
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <AppLayout />,
//       children: [
//         // {
//         //   path: "/",
//         //   element: <Home />
//         // },
//         {
//         index: true,
//         element: <Home />
//       },
//         {
//           path: "/about",
//           element: <About />
//         },
//         {
//           path: "/contact",
//           element: <Contact />
//         },
//         {
//           path: "/list",
//           element: <List />
//         }
//       ]
//     }
//   ]);

//   // const router = createBrowserRouter(
//   //   createRoutesFromElements(
//   //     <>
//   //       <Route path="/" element={<Home />} />
//   //       <Route path="/about" element={<About />} />
//   //       <Route path="/contact" element={<Contact />} />
//   //       <Route path="/list" element={<List />} />
//   //     </>
//   //   )
//   // );

//   return (
//     <>
//     {/*  */}
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default AppRouter;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import List from "../pages/List/List";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import SearchResultsPage from "../pages/SearchResultsPage/SearchResultsPage";
import PropertyDetailPage from "../pages/PropertyDetailPage/PropertyDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "list", element: <List /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgotpassword", element: <ForgotPassword /> },
      { path: "search-results", element: <SearchResultsPage /> },
      { path: "property-detail/:id", element: <PropertyDetailPage /> }
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
