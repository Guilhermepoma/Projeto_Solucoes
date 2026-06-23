import React, { createContext, useState, useEffect } from 'react';
import firebase from './firebaseConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const doc = await firebase.firestore().collection('usuarios').doc(authUser.uid).get();
        setIsAdmin(doc.exists && doc.data().isAdmin === true);
        setUser(authUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = firebase.firestore().collection('usuarios').doc(user.uid)
      .onSnapshot((doc) => {
        setIsAdmin(doc.exists && doc.data().isAdmin === true);
      });
    return () => unsub();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
