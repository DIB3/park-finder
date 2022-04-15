import React, { useState, useEffect } from 'react'
import { db, auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import NavigationBar from '../carte/navigation-barre'
import { FaParking,FaMoneyCheckAlt } from 'react-icons/fa'
import { RiTimerFlashLine } from 'react-icons/ri'
import { MdAttachMoney } from 'react-icons/md'
import { Alert, Modal, Button } from 'react-bootstrap'
import { Card ,ListGroup} from 'react-bootstrap'
import moment from 'moment'
import "../../css/dashboard.css"
import "../../css/global.css"


export default function Index() {

    const [show, setShow] = useState(false)
    // const [showQrModal, setShowQrModal] = useState(false)
    const [user, setUser] = useState({})
    const [userBalanceUpdated, setUserBalanceUpdated] = useState(0)
    const [bookings, setBookings] = useState([])
    const [userBalance, setUserBalance] = useState(0)
    const [bookingTotalNumber, setBookingTotalNumber] = useState(0)
    const [bookingQrCode, setBookingQrCode] = useState("")
    const [getTimeSpend, setGetTimeSpend] = useState(0)

    let history = useHistory()

    const handleClose = () => setShow(false);
    // const handleCloseQrModal = () => setShowQrModal(false);
    const handleShow = () => setShow(true);
    // const handleShowQrModal = () => setShowQrModal(true);

    

 
    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }

            setUser(user) // add user object to user state
            getUserBalance() // get user balance **
            getTimeSpendInTheParking()

            const bookingRef = db.collection("bookings")
            bookingRef
            .where("uid", "==", user.uid)
            .where("finished", "==", false)
            .orderBy("arrivalTime", "desc").limit(3)
            .get()
            .then((querySnapshot) => {
                var bookingTable = []
                var increment = 0
                // console.log('querySnapshot : ', querySnapshot)
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " DOC DATA => ", doc.data());
                    console.log('DOC : ', doc)
                    var bookingToPush = {
                        docId: doc.id,
                        arrivalTime: doc.data().arrivalTime,
                        departureTime: doc.data().departureTime,
                        bookingDate: doc.data().bookingDate,
                        carNumber: doc.data().carNumber,
                        parkingId: doc.data().parkingId,
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
    }, [user, setUser, setUserBalance, userBalance])



    // check if the user is bloqued by the admin
    function handleBloquedUser(user){
        db.collection("users").doc(user.uid).get()
        .then((doc) => {
            if (doc.exists){
                if(doc.data().isbloqued === true){
                    // sign out and redirect user to login page with a message
                    auth.signOut()
                        .then(() => {
                            history.push({
                                pathname: '/login',
                                state: { Error: 'OK' }
                            })
                        })
                        .catch(error => {
                            console.log("ERROR", error.message)
                        })
                }
            }
        })
        .catch((error) => {
            console.log("Error getting document: ", error);
        });
    }
    // we call the function
    handleBloquedUser(user)



    // Reduce 5MAD of the user balance
    function handleConfirm(){
      
        var UserRef = db.collection("users").doc(user.uid);
        var BookingRef = db.collection("bookings").doc(user.uid);
        
        var balanceUpdated = 0
        // get user balance
        UserRef.get().then((doc) => {
            if (doc.exists) {
                console.log('doc.Data().balance', doc.data().balance)
                balanceUpdated = Number(doc.data().balance) - 5
                console.log('balanceUpdated', balanceUpdated)
                setUserBalanceUpdated(balanceUpdated)

                UserRef.update({
                    balance: balanceUpdated
                })
                .then(() => {
                    console.log("Document successfully updated!");
                    let alert = document.querySelector('#alert-success')
                    alert.classList.remove('d-none')
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
        return false
    }



    // get user balance
    function getUserBalance(){

        if(user.uid !== ""){
            var UserRef = db.collection("users").doc(user.uid);
            console.log('USER ID : ', user.uid)
            UserRef.get().then((doc) => {
                if (doc.exists) {
                    console.log('doc.Data().balance', doc.data())
                    setUserBalance(doc.data().balance)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }else{
            console.log("ppppppppppppppppppp")
        }
    }


    // getTimeSpendInTheParkings *********************************
    function getTimeSpendInTheParking(){
        let bookingRef = db.collection("bookings")
        bookingRef
        .where("uid", "==", user.uid)
        .where("finished", "==", true)
        .get()
        .then((querySnapshot) => {
            var getTotalTimeSpend = 0
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                var eachbooking = Number(doc.data().userout.seconds) - Number(doc.data().userin.seconds)
                getTotalTimeSpend += eachbooking
            });

            // getTotalTimeSpend = new Date(getTotalTimeSpend)
            console.log('getTotalTimeSpend : ', getTotalTimeSpend)
            setGetTimeSpend(getTotalTimeSpend)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }



    function handleGoToShowQrCodeOfTheBooking(e, uid) {
        e.preventDefault()
        var BookingRef = db.collection("bookings").doc(uid);
        BookingRef.get().then((doc) => {
            if (doc.exists) {
                console.log("QR CODE : ", doc.data().qrimage)
                setBookingQrCode(doc.data().qrimage)

                history.push({
                    pathname: '/showqrcode',
                    state: { 
                        bookingId: doc.id,
                        qrimage: doc.data().qrimage
                    }
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        
       
      
    }



    return (
        
        <div>
            
        { console.log("render") }
        <div className="container">
        <div className="d-flex justify-content-center flex-wrap">


        <a href="/parkings" className="btn appBackgroundColor btn-lg btn-block mt-5" style={{ width: "85%" }} role="button">Booking now <img src="images/right-arrow.png" width="17px" alt="icon arrow" /></a>

            <div className="Espace1 mt-4">
                <div className="box"><FaMoneyCheckAlt/> {userBalance} MAD </div>
                <div className="box"><RiTimerFlashLine/> 8525 Time</div>
                <div className="box"><MdAttachMoney/> 7677 MAD</div>
                <div className="box"><FaParking/>{bookingTotalNumber} Bookings</div>
            </div>
            
            
            <a href="/allbookings" className="btn btn-block mt-1 appBackgroundColor" style={{ width: "85%" }} role="button">All bookings <img src="images/view.png" width="17px" alt="icon arrow" /></a>
            <a href="/parkingSpot" className="btn btn-block mt-1 appBackgroundColor" style={{ width: "85%" }} role="button">Parkings <img src="images/parking.png" width="22px" alt="icon arrow" /></a>


            <h1 className="text-center">Bookings</h1>

            <div className="Espace2">
            <Card style={{ width: "96%" }} style={{ marginBottom: "100px" }}>
                <ListGroup variant="flush">
                { bookings.map((booking, key) => (
                <>
                <ListGroup.Item key={key}>
                    <strong>Parking ID: </strong>{booking.parkingId}<br />
                    <strong>Car number: </strong>{booking.carNumber}<br />
                    <strong>Arrival time: </strong>{ moment(booking.arrivalTime).format("MMMM Do YYYY, h:mm:ss a") }<br />
                    <strong>Departure time: </strong>{ moment(booking.departureTime).format("MMMM Do YYYY, h:mm:ss a") }
                    <br />
                    <button className="btn appBackgroundColor" onClick={(e) => { handleGoToShowQrCodeOfTheBooking(e, booking.docId) } } style={{ opacity: "0.77" }}>show QR&ensp;<img src="images/view.png" width="19px" alt="view icon" /></button>&ensp;
                    <button className="btn appBackgroundColor" onClick={handleShow} style={{ opacity: "0.77" }}>Discard&ensp;<img src="images/delete.png" width="19px" alt="discard booking icon" /></button>
                </ListGroup.Item>
                </>
                )) }
                </ListGroup>
            </Card>
            </div>

        </div>



        { /* DISCARD MODAL */ }
        <Modal id="modal" show={show} onHide={handleClose}>
            <Modal.Header>
            <Modal.Title>
                <img src="images/x-button.png" width="38px" alt="logo" />
                &ensp; Cancel Booking
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert id="alert-success" className="d-none" variant="success">
                    Your booking is canceled succesfully your balance now is { userBalanceUpdated }
                </Alert>
                If you want to cancel your booking your balance will be reduce by a sum of <strong>5 MAD</strong>, by clicking on the confirm button below you accept to pay <strong>5 MAD</strong> for cancellation </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleConfirm}>
                Confirm
            </Button>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>


        
        </div>


        <NavigationBar/>
        </div>
    )
}
