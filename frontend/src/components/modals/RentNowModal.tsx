import {Modal} from "react-bootstrap";
import {HttpStatusCode} from "axios";
import properties from "@/properties/properties.ts";
import {useErrorContext} from "@/context/AlertContext.tsx";
import api from "@/axios/api.ts";
import Button from "react-bootstrap/Button";


function RentNowModal({bookId, refreshData, showRentNow, handleCloseRentNow } : {bookId: string, refreshData: () => void,
    showRentNow: boolean, handleCloseRentNow: () => void}) {

    const {setErrorMessage, setShowFailed,  setSuccessMessage, setShowSuccess} = useErrorContext();

    const onSubmitForm = () => {

        api.post(`${properties.serverAddress}/api/rents/now/${bookId}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then( () => {
                    refreshData();
                    setSuccessMessage("Book rented successfully");
                    setShowSuccess(true);
                    handleCloseRentNow();
                }
            ).catch( (error) => {
            const message = error.response.data.message;
            if (error.status == HttpStatusCode.Conflict) {
                setErrorMessage("Book already rented");

            }
            else if (error.status==HttpStatusCode.BadRequest) {
                if (message.includes("user")) {
                    setErrorMessage("User is not active");
                }
                else {
                    setErrorMessage("Book not found");
                }
            }
            else {
                setErrorMessage("Rent creation failed" + message);
            }
            setShowFailed(true);
            refreshData();
        })
    }

    return (
        <>
            <Modal show={showRentNow} onHide={handleCloseRentNow} contentClassName="bg-dark text-light border-black border-1">
                <Modal.Header closeButton>
                    <Modal.Title>Rent Now</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to rent this book now?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRentNow}>Cancel</Button>
                    <Button variant="primary" onClick={onSubmitForm}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}
export default RentNowModal;