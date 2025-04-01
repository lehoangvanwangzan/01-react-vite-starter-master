import { createContext, useState } from "react";
const AuthContext = createContext({
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: ""
});
const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
    })
    const [isAppLoading, setIsAppLoading] = useState(true);
    return (
        <AuthContext.Provider value={{ user, setUser, isAppLoading, setIsAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    )
}
export { AuthContext, AuthWrapper }