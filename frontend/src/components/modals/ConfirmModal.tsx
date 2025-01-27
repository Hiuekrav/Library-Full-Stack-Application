import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";



function ConfirmModal({show, close, closePrevious, onConfirmation, centered}:
                      { show: boolean, close: () => void, closePrevious?: () => void, onConfirmation: () => void, centered?: boolean} ) {
    return (
        <Modal show={show} onHide={close} backdrop="static"
               size="sm" centered={centered}
               contentClassName="bg-dark text-light border-info border-3">
            <Modal.Header closeButton>
                <Modal.Title>Action confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="primary" onClick={ () => {
                    onConfirmation();
                    close();
                    if (closePrevious) closePrevious();
                }
                }>
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default ConfirmModal;