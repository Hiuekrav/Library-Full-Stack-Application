import {useState} from "react";
import * as yup from "yup";
import AlertSuccess from "@/components/alerts/AlertSuccess.tsx";
import AlertError from "@/components/alerts/AlertError.tsx";
import {Formik} from "formik";
import properties from "@/properties/properties.ts";
import axios, {HttpStatusCode} from "axios";
import Form from "react-bootstrap/Form";
import {Button, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {PathNames} from "@/router/PathNames.ts";
import {jwtDecode} from "jwt-decode";
import {useUserContext} from "../../context/useUserContext.tsx";


interface LoginResponse {
    token: string
}

export function LoginForm() {


    const [showSuccess, setShowSuccess] = useState(false);

    const handleCloseSuccess = () => setShowSuccess(false);
    const handleShowSuccess = () => setShowSuccess(true);

    const [showFailed, setShowFailed] = useState(false);

    const handleCloseFailed = () => setShowFailed(false);
    const handleShowFailed = () => setShowFailed(true);

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const { setUser } = useUserContext();


    const schema = yup.object().shape({
        email: yup.string().required("E-mail is required").email("E-mail must have valid format"),
        password: yup.string().required('Password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
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
                        email: '',
                        password: '',
                    }}
                onSubmit = {(values) => {
                    const requestURL = `${properties.serverAddress}/api/auth/login`;

                    axios.post(requestURL, JSON.stringify(values), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then((r) => {
                            //todo redirect to home page with new identity
                            handleShowSuccess();
                            const response = r.data as LoginResponse
                            console.log(response.token)
                            const decodedToken: {sub: string, role: string} = jwtDecode(response.token)
                            setUser({email: decodedToken.sub,
                            role: decodedToken.role})
                            // Przekierowanie w zależności od roli użytkownika
                            navigate(PathNames.default.home);
                            localStorage.setItem("authToken", response.token);
                        })
                        .catch( (r) => {
                            console.log(r)
                            if (r.status==HttpStatusCode.BadRequest) {
                                setErrorMessage("Invalid credentials");
                            }
                            else {
                                setErrorMessage("User creation failed");
                            }
                            handleShowFailed()}
                        );
                }}
            >
                {({ handleSubmit, handleChange, values, errors}) =>
                {
                    return (
                        <>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-2">
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
                                </Row>
                                <Row className="mb-2">
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
                                </Row>
                                <Button type="submit" variant="outline-light">Sign in</Button>
                            </Form>
                        </>
                    )
                }}
            </Formik>
        </>
    )
}