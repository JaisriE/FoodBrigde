import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // LOGIN
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const loggedUser = {
      ...data.user,
      role: data.user.user_metadata?.role,   // ✅ SIMPLE
    };

    setUser(loggedUser);
    return loggedUser;
  };

  // REGISTER
  const register = async (name, email, password, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,   // ✅ stored in metadata
        },
      },
    });

    if (error) throw error;

    const newUser = {
      ...data.user,
      role,
    };

    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          ...data.session.user,
          role: data.session.user.user_metadata?.role,
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
