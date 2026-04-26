import React, { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const user = JSON.parse(stored);

    // Normalize: if user has _id but no id, copy it
    if (user && user._id && !user.id) user.id = user._id;
    // If your app uses { userData: { id } } structure, uncomment below:
    // if (user?.userData?._id && !user.userData.id) user.userData.id = user.userData._id;

    return user;
  });

  const UpdateUser = (userData) => {
    if (userData && userData._id && !userData.id) userData.id = userData._id;
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (currentUser) {
      const toStore = { ...currentUser };
      if (toStore._id && !toStore.id) toStore.id = toStore._id;
      localStorage.setItem("user", JSON.stringify(toStore));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, UpdateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};