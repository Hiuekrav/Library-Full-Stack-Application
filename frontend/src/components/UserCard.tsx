import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { User } from "@/model/User.ts";
import {Col, Modal} from "react-bootstrap";
import UserEditModal from "@/components/modals/UserEditModal.tsx";
import UserRentsModal from "@/components/modals/UserRentsModal.tsx";
import {HttpStatusCode} from "axios";
import properties from "@/properties/properties.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import api from "@/axios/api.ts";


function UserCard({ user, refreshData }: { user: User; refreshData: () => void }) {
    const userActive = user.active;
    const [signature, setSignature] = useState<string>("");
    const [modalState, setModalState] = useState({
        edit: false,
        rents: false,
        confirm: false,
        confirmEdit: false,
    });

    const { setErrorMessage, setShowFailed } = useErrorContext();

    const toggleModal = (modal: keyof typeof modalState, value: boolean) => {
        setModalState((prev) => ({ ...prev, [modal]: value }));
        if(modal === "edit") {
            api.get(`${properties.serverAddress}/api/users/${user.id}`)
                .then((response) => {
                    setSignature(response.headers.etag);
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                });
        }
    };


    const toggleActivation = () => {
        console.log(`User ${user.email} is now ${!userActive ? "activated" : "deactivated"}!`);
        toggleModal("confirm", false);
        let requestURL;
        if (userActive) {
            requestURL = `${properties.serverAddress}/api/users/${user.id}/deactivate`;
        } else {
            requestURL = `${properties.serverAddress}/api/users/${user.id}/activate`;
        }
        api.post(requestURL)
            .then(r => {
                console.log(r);
                refreshData();
            })
            .catch((error) => {
                if (error.status == HttpStatusCode.Conflict) {
                    setErrorMessage(`User already ${!userActive ? "activated" : "deactivated"}!`);
                    setShowFailed(true);
                }
                else if (error.status == HttpStatusCode.BadRequest) {
                    setErrorMessage(`User has active or future rents, cannot be deactivated`);
                    setShowFailed(true);
                }
                else {
                    setErrorMessage(`Unexpected error: ${error.errorMessage}`);
                    console.log(error)
                    setShowFailed(true);
                }
                refreshData();
            });

    };

    return (
        <>
            <Card key={user.id} style={{ width: "18rem", marginRight: "1rem",  marginLeft: "1rem",
            background: "#181a1b", borderColor: "#FFFFFF"}} className="text-light">
                <Card.Body>
                    <Card.Text className="mb-2 text-secondary font-bold">{ user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Card.Text>
                    <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-light" style={{color: "#e8e6e3"}}>{user.email}</Card.Subtitle>
                    <Card.Text>{user.cityName} {user.streetName} {user.streetNumber}</Card.Text>
                    <div className="row mb-2" style={{ display: "flex", justifyContent: "space-between" }}>
                        <Col xs="6">
                            <Button variant="primary" style={{ width: "100%" }} onClick={() => toggleModal("edit", true)}>
                                Edit
                            </Button>
                        </Col>
                        <Col xs="6">
                            <Button
                                variant={userActive ? "danger" : "success"}
                                style={{ width: "100%" }}
                                onClick={() => toggleModal("confirm", true)}
                            >
                                {userActive ? "Deactivate" : "Activate"}
                            </Button>
                        </Col>
                    </div>
                    {user.role === "reader" && (
                        <Button variant="info" className="text-white" style={{ width: "100%" }} onClick={() => toggleModal("rents", true)}>
                            Show Rents
                        </Button>
                    )}
                </Card.Body>
            </Card>

            {/* Edit Modal */}
            <UserEditModal user={user} signature={signature} refreshData={refreshData} showEdit={modalState.edit} handleCloseEdit={() =>toggleModal("edit", false)}></UserEditModal>

            {/* Confirm Activation Modal */}
            <Modal show={modalState.confirm} onHide={() => toggleModal("confirm", false)}
                   contentClassName="bg-dark text-light border-info border-3">
                <Modal.Header closeButton>
                    <Modal.Title>Action Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to {userActive ? "deactivate" : "activate"} this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => toggleModal("confirm", false)}>Close</Button>
                    <Button variant="primary" onClick={toggleActivation}>Confirm</Button>
                </Modal.Footer>
            </Modal>

            {/* ActiveRents Modal */}
            <UserRentsModal userId={user.id} showUserRents={modalState.rents} handleCloseUserRents={() =>toggleModal("rents", false)}></UserRentsModal>
        </>
    );
}

export default UserCard;
