import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../components/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password) => {
    auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      const userRef = db.collection("users").doc(auth.currentUser.uid);
      userRef.set({
        email: email,
        uid: newUser.user.uid,
        isAdmin: false,
      });
    });
  };

  const login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      if (user) {
        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then((response) => {
          setIsAdmin(response.data().isAdmin);
        });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const contextValue = {
    currentUser,
    signUp,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
