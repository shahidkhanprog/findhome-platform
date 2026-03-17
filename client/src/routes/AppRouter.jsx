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
import UserDashboard from "../pages/dashboard/UserDashboard";
import Profile from "../pages/dashboard/components/Profile";
import AddProperty from "../pages/dashboard/components/AddProperty";
import SavedPosts from "../pages/dashboard/components/SavedPosts";
import MyProperties from "../pages/dashboard/components/MyProperties";
import Messages from "../pages/dashboard/components/Messages";
import Overview from "../pages/dashboard/components/Overview";
import UserDashboardLayout from "../components/layout/UserDashboardLayout";

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
  // {
  //   path: "/",
  //   element: <RequireAuth />,
  //   children: [
  //     { path: "property-detail/:id", element: <PropertyDetailPage /> }, // just for testing 
  //     { path: "dashboard/", element: <UserDashboard /> }, // just for testing 
  //   ],
  // },
  {
    path: "/dashboard/*",
    element: <UserDashboardLayout />,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "addProperty", element: <AddProperty /> },
      { path: "myProperties", element: <MyProperties /> },
      { path: "favorites", element: <SavedPosts /> },
      { path: "messages", element: <Messages /> },
      { path: "overview", element: <Overview /> },
      // { path: "overview", element: <Overview /> },
      // { path: "overview", element: <Overview /> },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
