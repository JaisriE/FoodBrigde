import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const loggedUser = {
      ...data.user,
      role: data.user.user_metadata?.role,
      phone: data.user.user_metadata?.phone,
      address: data.user.user_metadata?.address,
    };

    setUser(loggedUser);
    return loggedUser;
  };

  // REGISTER (FINAL CORRECT VERSION)
  const register = async (name, email, password, role, phone, address) => {
    // Step 1: Create Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          phone,
          address,
        },
      },
    });

    if (error) throw error;

    const userId = data.user.id;

    // Step 2: Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          name,
          email,
          role,
          phone,
          address,
        },
      ]);

    if (profileError) throw profileError;

    const newUser = {
      ...data.user,
      role,
      phone,
      address,
    };

    setUser(newUser);
    return newUser;
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // SESSION HANDLING
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser({
          ...data.session.user,
          role: data.session.user.user_metadata?.role,
          phone: data.session.user.user_metadata?.phone,
          address: data.session.user.user_metadata?.address,
        });
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            ...session.user,
            role: session.user.user_metadata?.role,
            phone: session.user.user_metadata?.phone,
            address: session.user.user_metadata?.address,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
