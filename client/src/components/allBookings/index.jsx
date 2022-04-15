import React, { useState, useEffect } from 'react'
import { db, auth } from '../../firebase'
import { Card ,ListGroup} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import moment from 'moment'
import Header from '../carte/header'
import "../../css/global.css"
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Index() {

    const [bookings, setBookings] = useState([])
    const [user, setUser] = useState([])
    const [bookingTotalNumber, setBookingTotalNumber] = useState(0)

    let history = useHistory()


    useEffect(() => {
        {/* <Spinner animation="grow" size="sm" /> */}
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }

            setUser(user) // add user object to user state
            
            
            // ****
            const bookingRef = db.collection("bookings")
            bookingRef
            .where("uid", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                var bookingTable = []
                var increment = 0
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " DOC DATA => ", doc.data());
                    var bookingToPush = {
                        docId: doc.id,
                        arrivalTime: doc.data().arrivalTime,
                        departureTime: doc.data().departureTime,
                        bookingDate: doc.data().bookingDate,
                        carNumber: doc.data().carNumber,
                        parkingId: doc.data().parkingId,
                        finished: doc.data().finished,
                        qrImage: doc.data().qrimage
                    }
                    bookingTable.push(bookingToPush)
                    increment += 1
                });
                setBookings(bookingTable) // get bookings docs of the user
                setBookingTotalNumber(increment)

            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        })

    }, [setBookings])



    // get All Bookings
    function getAllBookings(){
        return true
    }



    {var status = ""}
    return (
        
        <>

            <Header route="/index" />

            <div className="container">
            <img src="images/park-finder-logo.png" style={{ marginTop: "80px", marginLeft: "100px", marginRight: "100px" }} width="150px" alt="park finder logo" />

            <h1 className="text-center mb-2">Bookings</h1>

    
            
            <div style={{ marginLeft: "20px" }}>Total Bookings :<strong> {bookingTotalNumber}</strong></div>

            <div className="Espace2">
            <Card style={{ width: "96%" }} style={{ marginBottom: "20px" }}>
                <ListGroup variant="flush">
                
                { bookings.map((booking, key) => (
                    
                <>
                <ListGroup.Item key={key} style={{ margin: "15px 0px" }}>
                    <strong className="appBackgroundColor">{ booking.finished === true ? status = "Status Finished" : status = "Status Pending" }</strong><br />
                    <strong>Parking ID: </strong>{booking.parkingId}<br />
                    <strong>Car number: </strong>{booking.carNumber}<br />
                    <strong>Arrival time: </strong>{ moment(booking.arrivalTime).format("MMMM Do YYYY, h:mm:ss a") }<br />
                    <strong>Departure time: </strong>{ moment(booking.departureTime).format("MMMM Do YYYY, h:mm:ss a") }
                    
                </ListGroup.Item>
                </>
                )) }
                </ListGroup>
            </Card>
            </div>

            </div>
        </>
    )
}
