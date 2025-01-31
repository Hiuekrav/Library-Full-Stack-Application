import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {Book} from "@/model/Book.ts";
import {Col, Modal} from "react-bootstrap";
import {useState} from "react";
import RentNowModal from "@/components/modals/RentNowModal.tsx";
import RentModal from "@/components/modals/RentModal.tsx";
import EditBookModal from "@/components/modals/EditBookModal.tsx";
import {useUserContext} from "../context/useUserContext.tsx";
import properties from "@/properties/properties.ts";
import api from "@/axios/api.ts";
import {HttpStatusCode} from "axios";
import {useErrorContext} from "@/context/AlertContext.tsx";

function BookCard({ book, refreshData }: { book: Book; refreshData: () => void }) {
    const [signature, setSignature] = useState<string>("");

    const [showRentNow, setRentNow] = useState(false);
    const handleCloseRentNow = () => setRentNow(false);
    const handleShowRentNow = () => setRentNow(true);

    const { setErrorMessage, setShowFailed } = useErrorContext();

    const [showArchiveModal, setArchiveModal] = useState(false);
    const handleCloseArchiveModal = () => setArchiveModal(false);
    const handleSetArchiveModal = () => setArchiveModal(true);

    const [showRent, setRent] = useState(false);
    const handleCloseRent = () => setRent(false);
    const handleShowRent = () => setRent(true);

    const [showEdit, setEdit] = useState(false);
    const handleCloseEdit = () => setEdit(false);
    const handleShowEdit = () => {
        setEdit(true);
        api.get(`${properties.serverAddress}/api/books/${book.id}`)
            .then((response) => {
                const newSignature = response.headers.etag;
                setSignature(newSignature);
            })
            .catch((error) => {
                console.error("Failed to fetch book data:", error);
            });
    };

    const userContext = useUserContext();

    const toggleActivation = () => {
        console.log(`Book ${book.title} is now ${!book.archive ? "archived" : "deactivated"}!`);
        let requestURL;
        if (book.archive) {
            requestURL = `${properties.serverAddress}/api/books/${book.id}/activate`;
        } else {
            requestURL = `${properties.serverAddress}/api/books/${book.id}/archive`;
        }
        api.post(requestURL)
            .then(r => {
                console.log(r);
                refreshData();
            })
            .catch((error) => {
                if (error.status == HttpStatusCode.BadRequest) {
                    setErrorMessage(`Book already ${book.archive ? "archived" : "activated"}!`);
                    setShowFailed(true);
                }
                else if (error.status == HttpStatusCode.Conflict) {
                    setErrorMessage(`Book is rented, cannot be archived`);
                    setShowFailed(true);
                }
                else {
                    setErrorMessage(`Unexpected error: ${error.errorMessage}`);
                    console.log(error)
                    setShowFailed(true);
                }
                refreshData();
            });}

return(
    <>
        <Card style={{ width: '18rem', marginRight: "1rem", marginLeft: "1rem",
            background: "#181a1b", borderColor: "#FFFFFF" }} className="text-light">
            <Card.Body>
                <Card.Title>
                    {book.title}{' '}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-secondary font-bold">
                    <strong>{book.author}</strong>
                </Card.Subtitle>
                <Card.Text>
                    <strong>Genre:</strong> {book.genre} <br />
                    <strong>Published:</strong> {book.publishedDate.toString()} <br />
                    <strong>Pages:</strong> {book.numberOfPages}
                </Card.Text>
                <div className="mt-2">
                {book.rented ? (
                    <Col xs="12">
                        <Button className="mb-3 w-100" variant="secondary" disabled>
                            Currently Rented
                        </Button>
                    </Col>
                ) : (
                    <div className="d-flex justify-content-between">
                        {userContext.user?.role === "LIBRARIAN" ? (
                            <>
                                <Col xs="6">
                                    <Button
                                        variant={!book.archive ? "danger" : "success"}
                                        style={{ width: "100%" }}
                                        onClick={handleSetArchiveModal}
                                    >
                                        {book.archive ? "Activate" : "Archive"}
                                    </Button>
                                </Col>
                                <Button variant="warning" onClick={handleShowEdit}>
                                    Edit Book
                                </Button>
                            </>

                        ) : (
                            <>
                                <Button variant="primary" onClick={handleShowRent}>
                                    Rent
                                </Button>
                                <Button variant="success" onClick={handleShowRentNow}>
                                    Rent Now
                                </Button>
                            </>
                        )}
                    </div>
                )}
                </div>
            </Card.Body>
        </Card>

        {/* Confirm Activation Modal */}
        <Modal show={showArchiveModal} onHide={handleCloseArchiveModal}
               contentClassName="bg-dark text-light border-info border-3">
            <Modal.Header closeButton>
                <Modal.Title>Action Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to {book.archive ? "archive" : "activate"} this book?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseArchiveModal}>Close</Button>
                <Button variant="primary" onClick={toggleActivation}>Confirm</Button>
            </Modal.Footer>
        </Modal>

        {userContext.user?.role === "LIBRARIAN" && (signature !== "") ? (
            <EditBookModal
            book={book}
            signature={signature}
            refreshData={refreshData}
            showEdit={showEdit}
            handleCloseEdit={handleCloseEdit}
            />
        ) : (
            <>
                <RentNowModal
                    bookId={book.id}
                    refreshData={refreshData}
                    showRentNow={showRentNow}
                    handleCloseRentNow={handleCloseRentNow}
                />
                <RentModal
                    bookId={book.id}
                    refreshData={refreshData}
                    showRent={showRent}
                    handleCloseRent={handleCloseRent}
                />
            </>
        )}
    </>
);
}

export default BookCard;