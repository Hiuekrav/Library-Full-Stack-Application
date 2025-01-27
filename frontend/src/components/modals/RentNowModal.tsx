import {Formik} from "formik";
import {Col, Modal, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import * as yup from "yup";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import axios, {HttpStatusCode} from "axios";
import properties from "@/properties/properties.ts";
import {User} from "@/model/User.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";


function RentNowModal({bookId, refreshData, showRentNow, handleCloseRentNow } : {bookId: string, refreshData: () => void,
    showRentNow: boolean, handleCloseRentNow: () => void}) {

    const [showConfirm, setConfirm] = useState(false);

    const handleCloseConfirm = () => setConfirm(false)

    const handleShowConfirm = () => setConfirm(true);

    const {setErrorMessage, setShowFailed,  setSuccessMessage, setShowSuccess} = useErrorContext();



    const schemaRentNow = yup.object().shape({
        email: yup.string().required("E-mail is required").email("E-mail must have valid format"),
    });

    return (
        <Modal show={showRentNow} onHide={handleCloseRentNow} contentClassName="bg-dark text-light border-black border-1">
            <Modal.Header closeButton>
                <Modal.Title>Rent a book now</Modal.Title>
            </Modal.Header>
            <Formik
                validationSchema={schemaRentNow}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={ () => handleShowConfirm()}

                initialValues={
                    {
                        email: '',
                    }
                }
            >


                {({ handleSubmit, handleChange, values, errors }) =>
                {
                    const onSubmitForm = () => {
                        const email = values.email;
                        axios.get(`${properties.serverAddress}/api/users`,
                            {
                                params: {email}
                            }).then( (response) => {

                                console.log(response);

                                const users = response.data as User[]

                                const rentNowBody= {
                                    readerId: users[0].id,
                                    bookId: bookId
                                };

                                console.log("Payload:", rentNowBody)

                                axios.post(`${properties.serverAddress}/api/rents/now`, JSON.stringify(rentNowBody),
                                    {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    .then( () => {
                                        refreshData();
                                        setSuccessMessage("Book rented successfully");
                                        setShowSuccess(true);
                                        }
                                    ).catch( (error) => {
                                        const message = error.response.data.message;
                                        if (error.status == HttpStatusCode.Conflict) {
                                            setErrorMessage("Book already rented");

                                        }
                                        else if (error.status==HttpStatusCode.BadRequest) {
                                            if (message.includes("user")) {
                                                setErrorMessage("User is not active");
                                            }
                                            else {
                                                setErrorMessage("Book not found");
                                            }
                                        }
                                        else {
                                            setErrorMessage("Rent creation failed" + message);
                                        }
                                        setShowFailed(true);
                                        refreshData();
                                }
                                )
                            })
                    }

                    return(
                    <>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            placeholder="email"
                                            autoFocus
                                            value={values.email}
                                            onChange={handleChange}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseRentNow}>
                                    Close
                                </Button>
                                <Button type="submit" variant="primary">
                                    Rent Now
                                </Button>
                            </Modal.Footer>
                        </Form>

                        <ConfirmModal show={showConfirm} close={handleCloseConfirm} closePrevious={handleCloseRentNow}
                                      onConfirmation={onSubmitForm}/>
                    </>
                )}}
            </Formik>
        </Modal>
    )

}
export default RentNowModal;