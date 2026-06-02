import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  register,
  login,
  googleLogin,
  getCurrentUser,
  logout as clearAuth,
} from '../api/authService';
import { getToken } from '../api/apiClient';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password, displayName, profileImage) => {
    return register(email, password, displayName, profileImage).then((authUser) => {
      setUser(authUser);
      return authUser;
    });
  };

  const singinuser = (email, password) => {
    return login(email, password).then((authUser) => {
      setUser(authUser);
      return authUser;
    });
  };

  const googleSignIn = (credential) => {
    return googleLogin(credential).then((authUser) => {
      setUser(authUser);
      return authUser;
    });
  };

  const singout = () => {
    clearAuth();
    setUser(null);
    return Promise.resolve();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    singinuser,
    googleSignIn,
    singout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
