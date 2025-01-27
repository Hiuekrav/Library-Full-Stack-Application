import {Modal, Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import {UserRent} from "@/model/UserRent.ts";
import properties from "@/properties/properties.ts";
import {RentDTO} from "@/model/RentDTO.ts";


function UserRentsModal({userId, showUserRents, handleCloseUserRents} : {
    userId: string, showUserRents: boolean, handleCloseUserRents: () => void}) {

    const [userRents, setUserRents] = useState<UserRent[]>([]);

    useEffect(() => {
        fetchUserRents().then((userRents) => setUserRents(userRents));
    }, []);


    const fetchUserRents = async () => {
        const response = await axios.get(`${properties.serverAddress}/api/rents/reader/${userId}/all`);
        console.log(response.data);
        console.log("ActiveRents fetched!!");

        const rents = response.data.map((rent: RentDTO) => ({
            title: rent.bookOutputDTO.title,
            beginTime: new Date(rent.beginTime),
            endTime: new Date(rent.endTime),
        }));
        console.log(rents)

       return rents
    }


    return (
        <Modal show={showUserRents} onHide={() => handleCloseUserRents()} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>List of rents</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {userRents.length === 0 ? (
                    <div>No rents found for this user.</div>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Book title</th>
                            <th>Begin time</th>
                            <th>End time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userRents.map((rent, index) => (
                            <tr key={index}>
                                <td>{rent.title}</td>
                                <td>{rent.beginTime.toLocaleString()}</td>
                                <td>{rent.endTime.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleCloseUserRents()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserRentsModal;