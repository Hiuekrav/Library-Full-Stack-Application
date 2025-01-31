
import React, {createContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { PathNames } from '../router/PathNames';
import {SidebarLayout} from "@/components/layouts/SidebarLayout.tsx";


interface UserProps {
    email: string | null,
    role: string | null
}

interface UserContextProps {
    user: UserProps
    setUser: (user: UserProps) => void;
    logOut: () => void
}

export const UserContext = createContext<UserContextProps>({
    user: { email: null, role: null},
    setUser: () => {},
    logOut: () => {},
});



export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProps>({ email: null, role: null})
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    console.log("UserContext!!!");

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log("No token found");
                // Brak tokenu, brak roli
                setUser({email:null, role: null})
                setLoading(false);
                return;
            }
            try {
                const decodedToken: { sub: string, role: string; exp: number } = jwtDecode(token);
                console.log(decodedToken);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    // Token wygasł
                    localStorage.removeItem('authToken'); //session storage zamiast tego
                    navigate(PathNames.anonymous.login);
                } else {
                    console.log("Set role: ", decodedToken.role);
                    setUser({email: decodedToken.sub,
                        role: decodedToken.role});
                }
            } catch {
                // Niepoprawny token
                localStorage.removeItem("authToken");
                setUser({email:null, role: null})
                navigate(PathNames.anonymous.login); // Przekierowanie na login
            }
            finally {
                setLoading(false);
            }
        };
        checkToken();
    }, [navigate]);

    const logOut = () => {
        localStorage.removeItem('authToken');
        setUser({email:null, role: null})
        navigate(PathNames.anonymous.login);
    };

    if (loading) {

        return <SidebarLayout><div>Loading...</div></SidebarLayout>;
    }

    return (
        <UserContext.Provider value={{ user, setUser, logOut }}>
            {children}
        </UserContext.Provider>
    );
};
