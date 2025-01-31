import { useState } from "react";
import * as yup from "yup";
import { Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import properties from "@/properties/properties.ts";
import { useErrorContext } from "@/context/AlertContext.tsx";
import api from "@/axios/api.ts";

function CreateBookModal({refreshData, showEdit, handleCloseEdit }: {
   refreshData: () => void,
    showEdit: boolean, handleCloseEdit: () => void
}) {

    const { setErrorMessage, setShowFailed } = useErrorContext();

    const [showConfirm, setConfirm] = useState(false);

    const handleCloseConfirm = () => setConfirm(false)

    const handleShowConfirm = () => setConfirm(true);

    const schemaEdit = yup.object().shape({
        title: yup.string().required("Title is required").min(2, "Title must be at least 2 characters long"),
        author: yup.string().required("Author is required").min(2, "Author must be at least 2 characters long"),
        numberOfPages: yup.number().required("Number of pages is required").min(1, "Number of pages must be at least 1"),
        genre: yup.string().required("Genre is required").min(2, "Genre must be at least 2 characters long"),
        publishedDate: yup.date().required("Published date is required"),
    });

    const fields = ["title", "author", "numberOfPages", "genre", "publishedDate"] as const;

    return (
        <>
            <Modal show={showEdit} onHide={() => handleCloseEdit()}
    contentClassName="bg-dark text-light border-dark border-1">
        <Modal.Header closeButton>
        <Modal.Title>Edit book</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Formik
        validationSchema={schemaEdit}
    validateOnChange={false}
    validateOnBlur={false}
    initialValues={
        {
            title: '',
            author: '',
            numberOfPages: '',
            genre: '',
            publishedDate: ''
        }

    }
    onSubmit={() => {
        handleShowConfirm();
    }}
>
    {({ values, handleChange, handleSubmit, errors }) => {
        const onSubmit = () => {

            // JSON to send to the backend
            console.log("Payload:", JSON.stringify(values));
            api.post(`${properties.serverAddress}/api/books/create`, JSON.stringify(values),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(r => {
                    console.log(r);
                    refreshData();
                })
                .catch((error) => {
                    console.log(error)
                    if (error.response.status == 409) {
                        setErrorMessage("Book title already exists. Please choose another title.");
                    } else if (error.response.status == 500) {
                        setErrorMessage("Internal server error.");
                    } else setErrorMessage("Invalid book category");
                    setShowFailed(true);
                });
        }
        return (
            <>
                <Form noValidate onSubmit={handleSubmit}>
            {fields.map((field) => (
                    <Form.Group key={field} className="mb-3">
                <Form.Label>{field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</Form.Label>
                <Form.Control
                type={field === "numberOfPages" ? "number" : field === "publishedDate" ? "date" : "text"}
        name={field}
        value={values[field]}
        onChange={handleChange}
        isInvalid={!!errors[field]}
        />
        <Form.Control.Feedback type="invalid">
            {typeof errors[field] === 'string' ? errors[field] : ''}
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
        onConfirmation={onSubmit} centered={true} />
        </>
    )
    }}
    </Formik>
    </Modal.Body>
    </Modal>
    </>
)
}

export default CreateBookModal;