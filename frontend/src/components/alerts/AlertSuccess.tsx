import {Alert} from "react-bootstrap";


function AlertSuccess( {message, show, handleClose, className} : {message: string, show: boolean, handleClose: () => void, className:string}) {
    return (
        <Alert show={show} variant="success" className={className} dismissible onClose={handleClose}>
            <Alert.Heading>Success</Alert.Heading>
            <p>
                {message}
            </p>
        </Alert>
    )
}

export default AlertSuccess;