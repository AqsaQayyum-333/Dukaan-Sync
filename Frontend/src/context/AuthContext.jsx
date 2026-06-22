import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
function AuthProvider({ children }) {
const [user, setUser] = useState(null);
useEffect(() => {
const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
if (token && storedUser) {
try {
const parsedUser = JSON.parse(storedUser);
setUser({ token, ...parsedUser });
} catch (error) {
setUser({ token });
}
} else if (token) {
setUser({ token });
}
}, []);
const login = (token, userData) => {
localStorage.setItem("token", token);
if (userData) {
localStorage.setItem("user", JSON.stringify(userData));
setUser({ token, ...userData });
} else {
setUser({ token });
}
};
const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
setUser(null);
};
return (
<AuthContext.Provider
value={{
user,
login,
logout
}}
>
{children}
</AuthContext.Provider>
);
}
export default AuthProvider;