import React, { useState, useEffect } from 'react'
import { db, auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import Header from '../carte/header'
import NavigationBar from '../carte/navigation-barre'
import '../../css/parkings.css'


export default function Index() {
    
    const [user, setUser] = useState({})
    const [parkings, setParkings] = useState([])
    const [balance, setBalance] = useState(0)
    const [parkingClassName, setparkingClassName] = useState("carre d-flex justify-content-center flex-wrap")
    let [error, setError] = useState("")
    let [alertStyleError, setAlertStyleError] = useState("alert alert-danger d-none")

    let history = useHistory()


    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }

            setUser(user) // add user object to user state

            // get balance of the user **************
            var docRef = db.collection("users").doc(user.uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setBalance(doc.data().balance)

                    if(doc.data().balance <= 0){
                        setError("You balance is 0 MAD please charge you balance in order to make a booking")
                        setAlertStyleError("alert alert-danger")
                        setparkingClassName("carre d-flex justify-content-center flex-wrap disabled")
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });


            // get parkings infos
            var parkingsTable = []
            db.collection("parkings").get()
            .then((querySnapshot) => {
                
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data().name)
                    var parkingsToPush = {
                        id: doc.id,
                        name: doc.data().name,
                        adresse: doc.data().adresse,
                        npl: doc.data().npl
                    }
                    parkingsTable.push(parkingsToPush)
                });

                setParkings(parkingsTable)
                console.log('Parkings : ', parkings)
            })
            .catch((error) => {
                console.log(error)
            })
        })


    }, [setUser, user, balance, setBalance])





    // get balance of the user
    function GetBalanceOfTheUser(){
        return true
    }
    
   
    // handleGoToBookingPage
    const handleGoToBookingPage = (parkingId) => {
       
        history.push({
            pathname: '/bookingform',
            state: { parkingId: parkingId }
        })
    }
    

    // check if the user is bloqued by the admin ******************************
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


    // handle Close Alert
    function handleCloseAlert(){
        setError("")
        setAlertStyleError("alert alert-danger d-none")
    }


return (
    <> 
        <Header route='/index' />

        <div className="header text-center">
            <img src="images/parkings-icon.png" style={{ marginTop: "100px" }} width="120px" alt="parkfinder logo" />
            <h1>Parkings</h1>
        </div>

       <div className="container">
            {/* Alerts */}
        <div className={ alertStyleError } role="alert"><strong>Warning !</strong> { error }
        <button type="button" onClick={handleCloseAlert} className="close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        
       </div>


        <div className="espace d-flex justify-content-center flex-wrap">
            { parkings.map((parking, key) => (
            <>
                <div key={key} id="parking-card" className={parkingClassName} onClick={() => handleGoToBookingPage(parking.id)}>
                    <h4><strong>Name</strong> {parking.name}</h4>
                    <em><strong>Adress</strong> {parking.adresse}</em>
                    <strong>Place free {parking.npl}</strong>
                </div>
            </>
            )) }

        
        </div>


        <NavigationBar />
    </>
    )
}
