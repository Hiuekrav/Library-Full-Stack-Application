import { useState } from "react";
import * as yup from "yup";
import { Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import { Book } from "@/model/Book.ts";
import ConfirmModal from "@/components/modals/ConfirmModal.tsx";
import properties from "@/properties/properties.ts";
import { useErrorContext } from "@/context/AlertContext.tsx";
import api from "@/axios/api.ts";

function EditBookModal({ book, signature, refreshData, showEdit, handleCloseEdit }: {
    book: Book, signature: string, refreshData: () => void,
    showEdit: boolean, handleCloseEdit: () => void
}) {

    const { setErrorMessage, setShowFailed } = useErrorContext();

    const editBook = { // holds only editable fields
        title: book.title,
        author: book.author,
        numberOfPages: book.numberOfPages,
        genre: book.genre,
        publishedDate: book.publishedDate
            ? new Date(book.publishedDate).toISOString().split('T')[0] // Convert to YYYY-MM-DD
            : ""
    };

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
                        initialValues={editBook}
                        onSubmit={() => {
                            handleShowConfirm();
                        }}
                    >
                        {({ values, handleChange, handleSubmit, errors }) => {
                            const onSubmit = () => {

                                const differences = fields.reduce((acc, field) => {
                                    if (values[field] !== editBook[field]) {
                                        acc[field] = values[field];
                                    }
                                    return acc;
                                }, {} as Record<string, any>);

                                const payload = {
                                    id: book.id,
                                    ...differences,
                                    publishedDate: differences.publishedDate ? new Date(differences.publishedDate).toISOString() : undefined
                                };

                                // JSON to send to the backend
                                console.log("Payload:", JSON.stringify(payload));
                                api.put(`${properties.serverAddress}/api/books/${book.id}`, JSON.stringify(payload),
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'If-Match': signature.trim().replace(/^"+|"+$/g, "")
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

export default EditBookModal;