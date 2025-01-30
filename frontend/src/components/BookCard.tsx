import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {Book} from "@/model/Book.ts";
import {Col} from "react-bootstrap";
import {useState} from "react";
import RentNowModal from "@/components/modals/RentNowModal.tsx";
import RentModal from "@/components/modals/RentModal.tsx";
import EditBookModal from "@/components/modals/EditBookModal.tsx";
import {useUserContext} from "../context/useUserContext.tsx";
import properties from "@/properties/properties.ts";
import api from "@/axios/api.ts";

function BookCard({ book, refreshData }: { book: Book; refreshData: () => void }) {
    const [signature, setSignature] = useState<string>("");

    const [showRentNow, setRentNow] = useState(false);
    const handleCloseRentNow = () => setRentNow(false);
    const handleShowRentNow = () => setRentNow(true);

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
                            <Button variant="warning" onClick={handleShowEdit}>
                                Edit Book
                            </Button>
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