import React, { createContext, useState, useEffect } from 'react';
import firebase from './firebaseConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Busca o campo isAdmin no Firestore
        const doc = await firebase.firestore().collection('usuarios').doc(user.uid).get();
        setIsAdmin(doc.exists && doc.data().isAdmin === true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
