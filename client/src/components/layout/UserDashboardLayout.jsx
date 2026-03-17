import { Navigate, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserDashboardLayout = () => {
  const { currentUser } = useContext(AuthContext);

  return !currentUser ? (<Navigate to="/login" />) : (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default UserDashboardLayout;
