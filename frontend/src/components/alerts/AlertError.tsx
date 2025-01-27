import {Alert} from "react-bootstrap";

interface AlertErrorProps {
    message: string;
    show: boolean;
    handleClose: () => void;
    className?: string;
}

const AlertError: React.FC<AlertErrorProps> = ({ message, show, handleClose, className }) => {
    return (
        <Alert show={show} variant="danger" dismissible onClose={handleClose}
        className={className}>
            <Alert.Heading>Error</Alert.Heading>
            <p>
                {message}
            </p>
        </Alert>
    )
}

export default AlertError;