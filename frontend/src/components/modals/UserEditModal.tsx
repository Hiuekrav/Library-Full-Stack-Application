import {useState} from "react";
import * as yup from "yup";
import {Form, Modal} from "react-bootstrap";
import {Formik} from "formik";
import Button from "react-bootstrap/Button";
import {User} from "@/model/User.ts";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import axios from "axios";
import properties from "@/properties/properties.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";


function UserEditModal({user, refreshData, showEdit, handleCloseEdit} : {user: User, refreshData:() => void,
    showEdit: boolean, handleCloseEdit: () => void}) {

    const { setErrorMessage, setShowFailed } = useErrorContext();

    const editUser = { //holds only editable fields
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        cityName: user.cityName,
        streetName: user.streetName,
        streetNumber: user.streetNumber,
    };

    const [showConfirm, setConfirm] = useState(false);

    const handleCloseConfirm = () => setConfirm(false)

    const handleShowConfirm = () => setConfirm(true);


    const schemaEdit = yup.object().shape({
        firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters long"),
        lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters long"),
        email: yup.string().required("E-mail is required").email("E-mail must have valid format"),
        cityName: yup.string().required("City is required").min(2, "City must be at least 2 characters long"),
        streetName: yup.string().required("Street is required").min(2, "Street must be at least 2 characters long"),
        streetNumber: yup.number().required("Street number is required").min(1, "Street number must be positive value"),
    });

    const fields = ["firstName", "lastName", "email", "cityName", "streetName", "streetNumber"] as const;

    //Moves focus to the next input field after Enter clicked
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const form = e.currentTarget.form as HTMLFormElement | null;
            if (form) {
                const index = Array.prototype.indexOf.call(form, e.currentTarget);
                const nextElement = form.elements[index + 1] as HTMLInputElement | null;
                if (index < form.elements.length - 1) {
                    nextElement?.focus();
                }
            }
        }
    };

    return (
        <>
        <Modal show={showEdit} onHide={() => handleCloseEdit()}
               contentClassName="bg-dark text-light border-dark border-1">
            <Modal.Header closeButton>
                <Modal.Title>Edit user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schemaEdit}
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={editUser}
                    onSubmit={() => {
                        handleShowConfirm();
                    }}
                >
                    {({ values, handleChange, handleSubmit, errors }) => {
                        const onSubmit = () => {

                            const differences = fields.reduce((acc, field) => {
                                if (values[field] !== editUser[field]) {
                                    if(field == "streetNumber"){
                                        acc[field] = values[field].toString();
                                    }
                                    else acc[field] = values[field];
                                }
                                return acc;
                            }, {} as Record<string, any>);

                            const payload = {
                                id: user.id, // Załóżmy, że `user` zawiera `id`
                                ...differences,
                            };

                            // JSON do wysłania do backendu
                            console.log("Payload:", JSON.stringify(payload));
                            axios.put(`${properties.serverAddress}/api/users/${user.id}`, JSON.stringify(payload),
                                {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(r => {
                                    console.log(r);
                                    refreshData();
                                })
                                .catch((error) => {
                                    if(error.response.status == 409){
                                        setErrorMessage("Email already exists. Please choose another one.");
                                    }
                                    else if(error.response.status == 500){
                                        setErrorMessage("Internal server error.");
                                    }
                                    else setErrorMessage("An unexpected error occurred.");
                                    setShowFailed(true);
                                });
                        }
                        return(
                            <>
                                <Form noValidate onSubmit={handleSubmit}>
                                    {fields.map((field) => (
                                        <Form.Group key={field} className="mb-3">
                                            <Form.Label>{field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</Form.Label>
                                            <Form.Control
                                                type={field === "streetNumber" ? "number" : "text"}
                                                name={field}
                                                value={values[field]}
                                                onChange={handleChange}
                                                onKeyDown={handleKeyDown}
                                                isInvalid={!!errors[field]}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors[field]}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    ))}
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => handleCloseEdit()}>Close</Button>
                                        <Button variant="primary" type="submit" onClick={() => {
                                            handleSubmit(); // Only submit if no validation errors
                                        }}>Save Changes</Button>
                                    </Modal.Footer>
                                </Form>
                                <ConfirmModal show={showConfirm} close={handleCloseConfirm} closePrevious={handleCloseEdit}
                                              onConfirmation={onSubmit} centered={true}/>
                            </>
                        )
                    }}
                </Formik>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default UserEditModal;