import {useUserContext} from "../context/useUserContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[]; // set the user-roles
}

export const RequireAuth: React.FC<ProtectedRouteProps> = ({allowedRoles, children}: {allowedRoles: string[],children: React.ReactNode})=>  {

    const navigate = useNavigate();
    const {user} = useUserContext();

    const [canRender, setCanRender] = useState(false); // Track when children can render
    console.log(user)

    useEffect(() => {
        const checkPermissions = () => {
            console.log("Allowed roles:"+ allowedRoles);
            console.log("User role:" + user.role as string)

            if (user.role === null) {
                console.log("role==null:");
                navigate('/', {replace: true});
            }
            else if (!allowedRoles.includes(user.role as string)) {
                console.log("Role not allowed!!!")
                navigate('/notfound', {replace: true} )
            } else {
                console.log("Role allowed")
            }
        }
        checkPermissions();
        setCanRender(true); // Allow rendering once the role is validated
    }, [allowedRoles, navigate, user.role]);

    if (!canRender) {
        // Prevent rendering until the role check is complete
        return null;
    }
    return children;
}