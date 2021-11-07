import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../components/firebase";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import { AnyPointerEvent } from "framer-motion/types/gestures/PanSession";

const AuthContext = createContext<any>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [roles, setRoles] = useState([{ isAdmin: false, isMod: false }]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((newUser: any) => {
        const userRef = db.collection("users").doc(newUser.user.uid);
        userRef.set({
          userInfo: {
            firstName,
            lastName,
            email: email,
            uid: newUser.user.uid,
            roles,
          },
        });
      });
  };

  const login = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);

      if (user) {
        history.replace("/Quiz/");

        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then((response: any) => {
          setRoles(response.data().userInfo.roles);
        });
      }
      setRoles([{ isAdmin: false, isMod: false }]);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  
const contextValue = {
  currentUser,
  signUp,
  login,
  logout,
  roles,
};


  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
