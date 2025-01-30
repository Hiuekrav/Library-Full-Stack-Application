import {useCallback, useEffect, useState} from "react";
import {useErrorContext} from "@/context/AlertContext.tsx";
import properties from "@/properties/properties.ts";
import {RentDTO} from "@/model/RentDTO.ts";
import {RentCard} from "@/components/RentCard.tsx";
import AlertError from "@/components/alerts/AlertError.tsx";
import AlertSuccess from "@/components/alerts/AlertSuccess.tsx";
import api from "@/axios/api.ts";


export default function FutureRents() {

    const [rents, setRents] = useState<RentDTO[]>([]);

    const {errorMessage, showFailed, setErrorMessage, setShowFailed, successMessage, showSuccess, setShowSuccess} = useErrorContext();

    useEffect(() => {
        fetchFutureRents().then((rents) => setRents(rents) )
            .catch (() =>
            {
                setErrorMessage("Failed to fetch future rents.");
                setShowFailed(true);
            });
    }, [setErrorMessage, setShowFailed]);

    const fetchFutureRents = useCallback(async () => {
        const response = await api.get(`${properties.serverAddress}/api/rents/reader/self/future`);
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
            <h1 className="text-3xl font-bold text-center">Future rents</h1>
            <AlertError message={errorMessage} show={showFailed} handleClose={() => setShowFailed(false)}
                        className="m-5">
            </AlertError>
            <AlertSuccess message={successMessage} show={showSuccess} handleClose={ () => setShowSuccess(false)}
                          className="m-5">
            </AlertSuccess>
            <div className="user-cards-container m-5">
                {rents.length === 0 ? (
                    <div className="text-center text-gray-400" style={{fontSize: "1.5rem", fontWeight: "bold"}}>
                        No future rents found.
                    </div>
                ) : (
                    <div className="row g-4">
                        {rents.map((rent) => (
                            <RentCard key={rent.id} rent={rent} type="future"
                                      refreshData={fetchFutureRents}></RentCard>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}