import {useState} from "react";
import * as yup from "yup";
import AlertSuccess from "@/components/alerts/AlertSuccess.tsx";
import AlertError from "@/components/alerts/AlertError.tsx";
import {Formik} from "formik";
import properties from "@/properties/properties.ts";
import Form from "react-bootstrap/Form";
import {Button, Row} from "react-bootstrap";
import {ref} from "yup";
import api from "@/axios/api.ts";

export function ChangePasswordForm() {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCloseSuccess = () => setShowSuccess(false);
    const handleShowSuccess = () => setShowSuccess(true);

    const [showFailed, setShowFailed] = useState(false);

    const handleCloseFailed = () => setShowFailed(false);
    const handleShowFailed = () => setShowFailed(true);

    const [errorMessage, setErrorMessage] = useState("");


    const schema = yup.object().shape({
        oldPassword: yup.string().required('Old password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        newPassword: yup.string().required('New password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        confirmNewPassword: yup.string().required("Password confirmation is required")
            .oneOf([ref('newPassword')], 'Passwords must match')
    });

    return (
        <>
            <AlertSuccess message={"Password changed successfully"} show={showSuccess} handleClose={handleCloseSuccess} className="" ></AlertSuccess>
            <AlertError message={errorMessage} show={showFailed} handleClose={handleCloseFailed} ></AlertError>
            <Formik
                validationSchema={schema}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={
                    {
                        oldPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    }}
                onSubmit = {(values) => {
                    const requestURL = `${properties.serverAddress}/api/users/change-password`;
                    const payload = {
                        oldPassword: values.oldPassword,
                        newPassword: values.newPassword
                    }
                    api.put(requestURL, JSON.stringify(payload), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(() => {
                            handleShowSuccess();
                        })
                        .catch( (r) => {
                            console.log(r)
                            setErrorMessage("Invalid password");
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
                                    <Form.Label>Old password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="oldPassword"
                                        placeholder="old password"
                                        value={values.oldPassword}
                                        onChange={handleChange}
                                        isInvalid={!!errors.oldPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.oldPassword}
                                    </Form.Control.Feedback>
                                </Row>
                                <Row className="mb-2">
                                    <Form.Label>New password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        placeholder="new password"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        isInvalid={!!errors.newPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.newPassword}
                                    </Form.Control.Feedback>
                                </Row>
                                <Row className="mb-2">
                                    <Form.Label>Confirm new password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmNewPassword"
                                        placeholder="confirm new password"
                                        value={values.confirmNewPassword}
                                        onChange={handleChange}
                                        isInvalid={!!errors.confirmNewPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmNewPassword}
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