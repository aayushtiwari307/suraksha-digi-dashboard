import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [family, setFamily] = useState(() => {
    const stored = localStorage.getItem('familyData');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (token, familyData) => {
    localStorage.setItem('familyToken', token);
    localStorage.setItem('familyData', JSON.stringify(familyData));
    setFamily(familyData);
  };

  const logout = () => {
    localStorage.removeItem('familyToken');
    localStorage.removeItem('familyData');
    setFamily(null);
  };

  return (
    <AuthContext.Provider value={{ family, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);