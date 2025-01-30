import {Formik} from "formik";
import * as yup from 'yup';
import {Button, Col, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {ref} from "yup";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import {useState} from "react";
import axios, {HttpStatusCode} from "axios";
import properties from "@/properties/properties.ts";
import AlertSuccess from "@/components/alerts/AlertSuccess.tsx";
import AlertError from "@/components/alerts/AlertError.tsx";

function CreateUserForm() {

    const [showConfirm, setConfirm] = useState(false);

    const handleCloseConfirm = () => setConfirm(false);
    const handleShowConfirm = () => setConfirm(true);


    const [showSuccess, setShowSuccess] = useState(false);

    const handleCloseSuccess = () => setShowSuccess(false);
    const handleShowSuccess = () => setShowSuccess(true);

    const [showFailed, setShowFailed] = useState(false);

    const handleCloseFailed = () => setShowFailed(false);
    const handleShowFailed = () => setShowFailed(true);

    const [errorMessage, setErrorMessage] = useState("");


    const schema = yup.object().shape({
        role: yup.string()
            .required("Role selection is required"),
        firstName: yup.string().required("First name is required").min(2, "First name must be at least 2 characters long"),
        lastName: yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters long"),
        email: yup.string().required("E-mail is required").email("E-mail must have valid format"),
        cityName: yup.string().required("City is required").min(2, "City must be at least 2 characters long"),
        streetName: yup.string().required("Street is required").min(2, "Street must be at least 2 characters long"),
        streetNumber: yup.number().required("Street number is required").min(1, "Street number must be positive value"),
        password: yup.string().required('Password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        confirmPassword: yup.string().required("Password confirmation is required")
            .oneOf([ref('password')], 'Passwords must match')
    });

    return (
        <>
            <AlertSuccess message={"User created successfully"} show={showSuccess} handleClose={handleCloseSuccess} className="" ></AlertSuccess>
            <AlertError message={errorMessage} show={showFailed} handleClose={handleCloseFailed} ></AlertError>
        <Formik
            validationSchema={schema}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={
            {
                role: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                cityName: '',
                streetName: '',
                streetNumber: ''
            }}
            onSubmit = {() => handleShowConfirm()}
        >
            {({ handleSubmit, handleChange, values, errors, resetForm }) =>
            {
                const onConfirmation = () => {
                    let requestURL;
                    if (values.role == 'Admin') {
                        requestURL = `${properties.serverAddress}/api/users/create-admin`;
                    }
                    else if (values.role == 'Librarian') {
                        requestURL = `${properties.serverAddress}/api/users/create-librarian`;
                    }
                    else requestURL = `${properties.serverAddress}/api/users/create-reader`;

                    axios.post(requestURL, JSON.stringify(values), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(() => {
                            handleShowSuccess();
                            resetForm();
                        })
                        .catch( (r) => {
                            if (r.status==HttpStatusCode.Conflict) {
                                setErrorMessage("Email already in use");
                            }
                            else if (r.status==HttpStatusCode.BadRequest) {
                                setErrorMessage("Requested user not found");
                            }
                            else {
                                setErrorMessage("User creation failed");
                            }
                            handleShowFailed()}
                        );
                };
                return (
                <>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-2">
                            <Col md="12">
                            <Form.Label>Role</Form.Label>
                            <Form.Select aria-label="Default select example"
                                         value={values.role}
                                         name="role"
                                         onChange={handleChange}
                                         isInvalid={!!errors.role}>
                                <option>Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Librarian">Librarian</option>
                                <option value="Client">Client</option>
                            </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.role}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md="6">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    placeholder="first name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Col>
                            <Col md="6">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    placeholder="last name"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md="6">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    placeholder="e-mail"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Col>
                            <Col md="6">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cityName"
                                    placeholder="city name"
                                    value={values.cityName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.cityName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.cityName}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md="6">
                                <Form.Label>Street</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="streetName"
                                    placeholder="street name"
                                    value={values.streetName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.streetName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.streetName}
                                </Form.Control.Feedback>
                            </Col>
                            <Col md="6">
                                <Form.Label>Street number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="streetNumber"
                                    placeholder="street number"
                                    value={values.streetNumber}
                                    onChange={handleChange}
                                    isInvalid={!!errors.streetNumber}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.streetNumber}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md="6">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Col>
                            <Col md="6">
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="confirm password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                        <Button type="submit" variant="outline-light">Submit form</Button>
                    </Form>
                    <ConfirmModal show={showConfirm} close={handleCloseConfirm} onConfirmation={onConfirmation} centered={true}/>
                </>
                )
            }}
        </Formik>
        </>
    )
}

export default CreateUserForm;