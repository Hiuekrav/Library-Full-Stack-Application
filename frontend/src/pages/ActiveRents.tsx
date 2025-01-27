import {useCallback, useEffect, useState} from "react";
import {RentDTO} from "@/model/RentDTO.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import axios from "axios";
import properties from "@/properties/properties.ts";
import {RentCard} from "@/components/RentCard.tsx";
import AlertError from "@/components/alerts/AlertError.tsx";
import AlertSuccess from "@/components/alerts/AlertSuccess.tsx";

export default function ActiveRents() {
    const [rents, setRents] = useState<RentDTO[]>([]);

    const {errorMessage, showFailed, setErrorMessage, setShowFailed, successMessage, showSuccess, setShowSuccess} = useErrorContext();

    useEffect(() => {
        fetchActiveRents().then((rents) => setRents(rents) )
            .catch (() =>
            {
                setErrorMessage("Failed to fetch active rents.");
                setShowFailed(true);
            });
    }, [setErrorMessage, setShowFailed]);

    const fetchActiveRents = useCallback(async () => {
        const response = await axios.get(`${properties.serverAddress}/api/rents/active`);
        if (response.status==204) {
            setRents([])
            return [];
        }
        const rentList = response.data.map( (item: any) => new RentDTO(item));
        setRents(rentList);
        return rentList;
    }, []);


    return (
        <>
            <h1 className="text-3xl font-bold text-center">Active rents</h1>
            <AlertError message={errorMessage} show={showFailed} handleClose={() => setShowFailed(false)}
                        className="m-5">
            </AlertError>
            <AlertSuccess message={successMessage} show={showSuccess} handleClose={ () => setShowSuccess(false)}
                          className="m-5">
            </AlertSuccess>
            <div className="user-cards-container m-5">
                    {rents.length === 0 ? (
                            <div className="text-center text-gray-400" style={{fontSize: "1.5rem", fontWeight: "bold"}}>
                                No active rents found.
                            </div>
                        ) : (
                        <div className="row g-4">
                            {rents.map((rent) => (
                                <RentCard key={rent.id} rent={rent} type="active"
                                          refreshData={fetchActiveRents}></RentCard>
                            ))}
                        </div>
                    )}
            </div>
        </>
    )
}
