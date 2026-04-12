import React, { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const UpdateUser = (userData) => {
    setCurrentUser(userData);
  };

  //  Added logout — clears state and localStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    // logout added to value so Navbar can access it
    <AuthContext.Provider value={{ currentUser, UpdateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};