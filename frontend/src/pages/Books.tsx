import BookCard from "@/components/BookCard.tsx";
import {Book} from "@/model/Book.ts";
import {useEffect, useState} from "react";
import properties from "@/properties/properties.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import AlertError from "@/components/alerts/AlertError.tsx";
import AlertSuccess from "@/components/alerts/AlertSuccess.tsx";
import api from "@/axios/api.ts";
import CreateBookModal from "@/components/modals/CreateBookModal.tsx";
import Button from "react-bootstrap/Button";
import {useUserContext} from "@/context/useUserContext.tsx";


function Books() {

    const [books, setBooks] = useState<Book[]>([]);
    const[showCreate, setShowCreate] = useState(false)
    const{user} = useUserContext();

    const handleCloseCreate = () => setShowCreate(false)

    const {errorMessage, showFailed, setShowFailed, successMessage, showSuccess, setShowSuccess, setErrorMessage} = useErrorContext();

    useEffect(() => {
        fetchBooks().then((books) => setBooks(books) )
            .catch( ()=> {
                setErrorMessage("Failed to fetch books");
                setShowFailed(true);
            }

        );
        }, []);

    async function fetchBooks(): Promise<Book[]> {
        const response = await api.get(`${properties.serverAddress}/api/books/all`);
        const books = response.data as Book[];
        setBooks(books);
        return books;
    }


    return (
        <>
            <h1 className="text-3xl font-bold text-center">Books</h1>
            <AlertError message={errorMessage} show={showFailed} handleClose={() => setShowFailed(false)}
                        className="m-5">
            </AlertError>
            <AlertSuccess message={successMessage} show={showSuccess} handleClose={() => setShowSuccess(false)}
                          className="m-5">
            </AlertSuccess>

            {user.role == "LIBRARIAN" && (
                <>
                <div className="justify-items-center text-center m-5">
                    <Button variant="secondary" className="text-center" onClick={() => setShowCreate(true)}>Create
                        book</Button>
                </div>
                <CreateBookModal
                refreshData={fetchBooks}
            showEdit={showCreate}
            handleCloseEdit={handleCloseCreate}/>
                </>
    )
}


    <div className="user-cards-container m-5">
        {books.length === 0 ? (
            <div className="text-center text-gray-400" style={{fontSize: "1.5rem", fontWeight: "bold"}}>
                No books found.
            </div>
        ) : (
            <div className="row g-4">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} refreshData={fetchBooks}></BookCard>
                    ))}
                </div>
                )}
            </div>
        </>
)
}

export default Books;