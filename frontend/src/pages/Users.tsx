import UserCard from "@/components/UserCard.tsx";
import {User} from "@/model/User.ts";
import React, {useCallback, useEffect, useState}  from "react";
import properties from "@/properties/properties.ts";
import AlertError from "@/components/alerts/AlertError.tsx";
import {useErrorContext} from "@/context/AlertContext.tsx";
import api from "@/axios/api.ts";

export type ContextType = {
    showAlert: () => void;
    setErrorMessage: (message: string) => void;
};


function Users(){
    const [users, setUsers] = useState<User[]>([]); // Stan dla przechowywania użytkowników
    const [search, setSearch] = useState("");
    const {errorMessage, showFailed, setErrorMessage, setShowFailed} = useErrorContext();

     useEffect(() => {
        fetchUsers().then((users) => setUsers(users) )
            .catch (() =>
            {
                setErrorMessage("Failed to fetch users.");
                setShowFailed(true);
            });
     }, [setErrorMessage, setShowFailed]);

    const fetchUsers = useCallback(async () => {
        const response = await api.get(`${properties.serverAddress}/api/users/all`);
        console.log(response.data);
        console.log("Data refreshed!!");
        setUsers(response.data);
        return response.data as User[];
    }, []);

    const filteredUsers = useCallback(async (email: string) => {
        if(!email) {
            await fetchUsers();
            return;
        }
        try {
            const response = await api.get(`${properties.serverAddress}/api/users`,
                {
                    params: {email}
                });
            console.log(`Searched users:`, response.data);
            setUsers(response.data);
        }
        catch (e) {
            console.log("Error searching users", e);
            setErrorMessage("Error searching users.");
            setShowFailed(true);
            setUsers([]);
        }
    }, [fetchUsers, setErrorMessage, setShowFailed]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setSearch(email);
        filteredUsers(email)
            .then(r =>
                console.log(r)
            )
            .catch(e =>
                console.log(e)
            );
    }
    return (
        <>
            <h1 className="text-3xl font-bold text-center">Users</h1>
            <div className="search-bar-container m-5 d-flex justify-content-center">
                <input type="text" placeholder="Search by email..." className="form-control"
                       style={{
                           width: "45%",
                           marginLeft: "auto",
                           marginRight: "auto",
                       }}
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>
                <AlertError message={errorMessage} show={showFailed} handleClose={() => setShowFailed(false)}
                            className="m-5">

                </AlertError>
            <div className="user-cards-container m-5">
                {users.length === 0 ? (
                    <div className="text-center text-gray-400" style={{fontSize: "1.5rem", fontWeight: "bold"}}>
                        No users found.
                    </div>
                ) :
                    (
                    <div className="row g-4">
                        {users.map((user) => (
                            <UserCard user={user} refreshData={fetchUsers}></UserCard>
                        ))}
                    </div>
                    )}
            </div>
        </>
    )
}


export default Users;