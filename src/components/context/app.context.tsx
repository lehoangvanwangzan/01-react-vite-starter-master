import { createContext, useContext, useState } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setUser: (user: IUser) => void;
    user: IUser | null;
    setIsAppLoading: (isAppLoading: boolean) => void;
    isAppLoading: boolean;
}
const CurrentAppContext = createContext<IAppContext | null>(null);
type TProps = {
    children: React.ReactNode
}
export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    return (
        <CurrentAppContext.Provider value={
            { isAuthenticated, user, isAppLoading, setIsAuthenticated, setUser, setIsAppLoading }
        }>
            {props.children}
        </CurrentAppContext.Provider>
    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "CurrentAppContext has to be used within <CurrentUserContext.Provider>"
        );
    }
    return currentAppContext;
}