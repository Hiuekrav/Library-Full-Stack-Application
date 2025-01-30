import {RentDTO} from "@/model/RentDTO.ts";
import Card from "react-bootstrap/Card";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {HttpStatusCode} from "axios";
import properties from "@/properties/properties.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import {useState} from "react";
import api from "@/axios/api.ts";


export function RentCard({rent, type, refreshData} : {rent:RentDTO, type:string, refreshData: () => void}) {

    const [showConfirmEndRent, setConfirmEndRent] = useState(false);

    const handleShowConfirmEndRent = () => {setConfirmEndRent(true)}

    const { setErrorMessage, setShowFailed, setSuccessMessage, setShowSuccess } = useErrorContext();

    const endRent = () => {
        api.post(`${properties.serverAddress}/api/rents/${rent.id}/end`).then( () =>{
            refreshData();
            setSuccessMessage("Rent ended successfully");
            setShowSuccess(true)
        }).catch( (error) => {
                if(error.status==HttpStatusCode.BadRequest) {
                    setErrorMessage("Rent not found");
                    setShowFailed(true);
                } else {
                    setErrorMessage(`Unexpected error: ${error.errorMessage}`)
                    setShowFailed(true);
                }
                refreshData();
            }
        )
    }

    return (

        <>
            <Card style={{ width: '18rem', marginRight: "1rem", marginLeft: "1rem",
                background: "#181a1b", borderColor: "#FFFFFF" }} className="text-light">
                <Card.Body>
                    <Card.Text>
                        <Row className="mb-2">
                            <Col>
                                <strong>Title:</strong>
                            </Col>
                            <Col>
                                {rent.bookOutputDTO.title}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <strong>User:</strong>
                            </Col>
                            <Col>
                                {rent.userOutputDTO.email}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <strong>Begin time:</strong>
                            </Col>
                            <Col>
                                {rent.beginTime.toLocaleString()}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <strong>End time:</strong>
                            </Col>
                            <Col>
                                <span>{rent.endTime.toLocaleString()}</span>
                            </Col>
                        </Row>
                    </Card.Text>
                    <div className="mt-2">

                        { type=="active" &&
                        (
                            // <div className="d-flex justify-content-between">
                                <Button
                                    variant="primary"
                                    onClick={handleShowConfirmEndRent}
                                >
                                    End rent
                                </Button>
                            // </div>
                        )
                        }
                    </div>
                </Card.Body>
            </Card>
        <ConfirmModal show={showConfirmEndRent} close={ () => {setConfirmEndRent(false)}} onConfirmation={endRent}></ConfirmModal>
        </>
    )


}