import {Modal, Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useCallback, useEffect, useState} from "react";
import {HttpStatusCode} from "axios";
import {UserRent} from "@/model/UserRent.ts";
import properties from "@/properties/properties.ts";
import {RentDTO} from "@/model/RentDTO.ts";
import api from "@/axios/api.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";

function UserRentsModal({userId, showUserRents, handleCloseUserRents} : {
    userId: string, showUserRents: boolean, handleCloseUserRents: () => void}) {

    const [userRents, setUserRents] = useState<UserRent[]>([]);
    const [showConfirmDeletion, setConfirmDeletion] = useState(false);
    const [selectedRentId, setSelectedRentId] = useState<string | null>(null);
    const { setErrorMessage, setShowFailed, setSuccessMessage, setShowSuccess } = useErrorContext();

    const fetchUserRents = useCallback(async () => {
        const response = await api.get(`${properties.serverAddress}/api/rents/reader/${userId}/all`);
        console.log(response.data);
        console.log("ActiveRents fetched!!");
        if (response.status== HttpStatusCode.NoContent) {
            return []
        }
        const rents = response.data.map((rent: RentDTO) => ({
            id: rent.id,
            title: rent.bookOutputDTO.title,
            beginTime: new Date(rent.beginTime),
            endTime: new Date(rent.endTime),
        }));
        console.log(rents)
        setUserRents(rents)
        return rents
    }, [userId]);

    useEffect(() => {
        fetchUserRents().then((rents) => setUserRents(rents));
    }, [fetchUserRents]);

    const deleteRent = useCallback( async() => {
        if (!selectedRentId) return;

        await api.delete(`${properties.serverAddress}/api/rents/${selectedRentId}`).then(() => {
            fetchUserRents().then( (rents) =>
                setUserRents(rents)
            )
            setSuccessMessage("Rent deleted successfully");
            setShowSuccess(true)
        }).catch((error) => {
                console.log(error);
                if (error.status == HttpStatusCode.BadRequest) {
                    setErrorMessage("Rent not found");
                } else {
                    setErrorMessage(`Unexpected error: ${error.response.data.message}`)
                }
                setShowFailed(true);
            }
        ).finally(() => {
            setConfirmDeletion(false);
            setSelectedRentId(null);
        })
    }, [fetchUserRents, selectedRentId, setErrorMessage, setShowFailed, setShowSuccess, setSuccessMessage])



    return (
        <>
            <Modal show={showUserRents} onHide={() => handleCloseUserRents()} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>List of rents</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userRents.length === 0 ? (
                        <div>No rents found for this user.</div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Book title</th>
                                <th>Begin time</th>
                                <th>End time</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userRents.map((rent, index) => {
                                const isArchival = rent.endTime < new Date(); // Sprawdź, czy wypożyczenie jest archiwalne
                                return (
                                    <tr key={index}>
                                        <td>{rent.title}</td>
                                        <td>{rent.beginTime.toLocaleString()}</td>
                                        <td>{rent.endTime.toLocaleString()}</td>
                                        <td>
                                            {!isArchival && ( // Renderuj przycisk tylko jeśli wypożyczenie nie jest archiwalne
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        setSelectedRentId(rent.id);
                                                        setConfirmDeletion(true);
                                                    }}
                                                >
                                                    Delete Rent
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseUserRents()}>Close</Button>
                </Modal.Footer>
            </Modal>

            <ConfirmModal
                show={showConfirmDeletion}
                close={() => setConfirmDeletion(false)}
                onConfirmation={deleteRent}
                centered
            />
        </>
    );
}

export default UserRentsModal;