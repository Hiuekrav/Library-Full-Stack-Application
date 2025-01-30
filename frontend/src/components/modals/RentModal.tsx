import {useState} from "react";
import * as yup from "yup";
import {Col, Modal, Row} from "react-bootstrap";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import properties from "@/properties/properties.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import api from "@/axios/api.ts";


function RentModal({bookId, refreshData, showRent, handleCloseRent } : {bookId: string, refreshData: () => void,
    showRent: boolean, handleCloseRent: () => void}) {

    const [showConfirm, setConfirm] = useState(false);

    const handleCloseConfirm = () => setConfirm(false)

    const handleShowConfirm = () => setConfirm(true);

    const {setErrorMessage, setShowFailed,  setSuccessMessage, setShowSuccess} = useErrorContext();


    const schemaRent = yup.object().shape({
        beginTime: yup.date()
            .required("Begin date is required")
            .min(new Date(), "Begin date cannot be in the past"),
        endTime: yup.date()
            .required("End date is required")
            .min(yup.ref('beginTime'), "end date can't be before start date"),
    });

    return (
        <Modal show={showRent} onHide={handleCloseRent} contentClassName="bg-dark text-light border-black border-1">
            <Modal.Header closeButton>
                <Modal.Title>Rent a book now</Modal.Title>
            </Modal.Header>
            <Formik
                validationSchema={schemaRent}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={ () => handleShowConfirm()}

                initialValues={
                    {
                        beginTime: '',
                        endTime: '',
                    }
                }
            >
                {({ handleSubmit, handleChange, values, errors }) =>
                {
                    const onSubmit = () => {
                            const rentBody= {
                                beginTime: values.beginTime,
                                endTime: values.endTime,
                                bookId: bookId
                            };
                            console.log("Payload:", rentBody)

                            api.post(`${properties.serverAddress}/api/rents/reader`, JSON.stringify(rentBody),
                                {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then( () => {
                                        setSuccessMessage("Book rented successfully");
                                        setShowSuccess(true);
                                    }
                                ).catch( () => {
                                    setErrorMessage("Rent creation failed");
                                    setShowFailed(true);
                                }
                            )
                        refreshData();
                    }
                    return(
                        <>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            <Form.Label>Begin date</Form.Label>
                                            <Form.Control className="mb-3"
                                                name="beginTime"
                                                type="datetime-local"
                                                value={values.beginTime}
                                                onChange={handleChange}
                                                isInvalid={!!errors.beginTime}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.beginTime}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>End date</Form.Label>
                                            <Form.Control className="mb-3"
                                                name="endTime"
                                                type="datetime-local"
                                                value={values.endTime}
                                                onChange={handleChange}
                                                isInvalid={!!errors.endTime}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.endTime}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseRent}>
                                        Close
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Rent Now
                                    </Button>
                                </Modal.Footer>
                            </Form>

                            <ConfirmModal show={showConfirm} close={handleCloseConfirm} closePrevious={handleCloseRent}
                                          onConfirmation={onSubmit}/>
                        </>
                    )}}
            </Formik>
        </Modal>
    )
}
export default RentModal;