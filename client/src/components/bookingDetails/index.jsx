import React, { useState, useEffect } from 'react'
import { db, auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import Header from '../carte/header'
import moment from 'moment'
import '../../css/global.css'


export default function Index(props) {

    const [user, setUser] = useState({})
    const [parkingId, setParkingId] = useState("")
    const [parking, setParking] = useState({})
    const [arrivalTime, setArrivalTime] = useState(0)
    const [departureTime, setDepartureTime] = useState(0)
    const [hoursStayed, setHoursStayed] = useState(0)
    const [minutesStayed, setMinutesStayed] = useState(0)
    const [priceToPay, setPriceToPay] = useState(0)
    const [bookingToAdd, setBookingToAdd] = useState({})
    const [docRef, setdocRef] = useState("")

    const [hideSubmitBtn, setHideSubmitBtn] = useState("btn btn-block appBackgroundColor mt-3 d-block")
    const [hideGoBackToQrCodeBtn, setHideGoBackToQrCodeBtn] = useState("mt-3 d-none")

    let history = useHistory()



    // [[[[[[    handle Calcul Price   ]]]]]]
    function handleCalculPrice(){
        let pricePerHour = 5
        var getHoursStayed = 0
        var getMinutesStayed = 0
        var priceToPay = 0
        var taxToAdd = 0
        const tax = 0

        // convert seconds to hours && minutes
        var departure_h = new Date(departureTime).getHours()
        var arrival_h = new Date(arrivalTime).getHours()
        var departure_m = new Date(departureTime).getMinutes()
        var arrival_m = new Date(arrivalTime).getMinutes()

        getHoursStayed = Number(departure_h) - Number(arrival_h)
        getMinutesStayed = Number(departure_m) - Number(arrival_m)

        // get minutes positive
        if(getMinutesStayed < 0){
            getMinutesStayed = Number(getMinutesStayed) * (-1)
        }

        // if departure minutes inférieur à arrival minutes 
        if(departure_m < arrival_m){
            getMinutesStayed = 60 - Number(getMinutesStayed)
        }
            
        // en déduit une heure si les minutes et plus que 0 ***
        if(getHoursStayed !== 1 && getMinutesStayed > 0){
            getHoursStayed = Number(getHoursStayed) - 1
        }

        
        // setState
        setHoursStayed(getHoursStayed)
        setMinutesStayed(getMinutesStayed)
        
        var minutesPrice = 0
        if(getMinutesStayed >= 30){
            minutesPrice = 2.5
        }else{
            if(getHoursStayed === 0){
                minutesPrice = 2.5
            }
        }

        
        taxToAdd = (Number(getHoursStayed * pricePerHour) + Number(minutesPrice)) * tax
        priceToPay = Number(getHoursStayed * pricePerHour) + Number(minutesPrice) + taxToAdd
        setPriceToPay(priceToPay)

        // console.log('props : ', props)
        // console.log("departureTime : ", departureTime)
        // console.log("arrivalTime : ", arrivalTime)
        // console.log("getHoursStayed : ", getHoursStayed)
        // console.log('getMinutesStayed', getMinutesStayed)
        // console.log('priceToPay', priceToPay)
    }



    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')

        console.log('props location : ', props.location)
       
        if(props.location.state === undefined){
            history.push('/bookingform')
        }

        // affect props
        setArrivalTime(props.location.state.bookingToAdd.arrivalTime)
        setDepartureTime(props.location.state.bookingToAdd.departureTime)
        setBookingToAdd(props.location.state.bookingToAdd)
        setParkingId(props.location.state.bookingToAdd.parkingId)
    
        
        if(props.location.state.docRef !== ""){
            setdocRef(props.location.state.docRef)
        }

        if(props.location.state !== undefined && props.location.state.return === true){
            setHideSubmitBtn('btn btn-block appBackgroundColor mt-4 d-none')
            setHideGoBackToQrCodeBtn('mt-3 d-block')
        }

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }

            console.log('parkingID : ', parkingId)
            console.log('doRef : ', props.location.state.docRef)

            setUser(user) // add user object to user state
            getParkingInfos()

            setTimeout(() => {
                handleCalculPrice()
                console.log('Price to pay : ', priceToPay)
            }, 1000);
        })
    }, [arrivalTime, setArrivalTime])





    // handle get parkings infos
    function getParkingInfos(){
        var docRef = db.collection("parkings").doc(props.location.state.bookingToAdd.parkingId);

        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                setParking(doc.data())
                setParkingId(doc.id)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }



    // handleSubmit
    function handleSubmit(e){
        e.preventDefault()
        // add booking to a db
        db.collection("bookings").add(bookingToAdd)
        .then((DocReff) => {
            console.log("Document written with ID: ", DocReff.id)
            setdocRef(DocReff.id) // docRef: docRef.id

            // redirection to qrcode page
            history.push({
                pathname: '/qrcode',
                state: { 
                    bookingToAdd: bookingToAdd,
                    docRef: DocReff.id,
                    priceToPay: priceToPay
                }
            })
        })
        .catch((error) => {
            console.error("Error adding document: ", error)
        });
        
    }


    // handleGoBackToQrCodePage
    function handleGoBackToQrCodePage(){
        // redirection to qrcode page
        history.push({
            pathname: '/qrcode',
            state: { 
                bookingToAdd: bookingToAdd,
                docRef: props.location.state.docRef,
                priceToPay: priceToPay
            }
        })
    }
  


    return (
        <>
            <Header route='/bookingform' params={{ parkingId: parkingId }} />

            <div>
                <h1 className="text-center mb-2" style={{ marginTop: "100px", position: "relative", top: "-10px" }}>Booking details</h1>
            </div>
                
            <div className="bg-white d-flex justify-content-start flex-wrap p-2">
                <span className="text-dark pt-3 pb-2">Parking ID: <strong>#{ parkingId } </strong></span>
                <span className="text-dark pb-2">Parking name: <strong>{ parking.name }</strong></span>
                <span className="text-dark pb-2">Parking address: <strong>{ parking.adresse }</strong></span>
            </div>

            <div className="container mt-2 col-10">
                <div className="mt-4 d-flex justify-content-center flex-wrap">
                    <div>
                    <img src="images/calendar.png" width="29px" alt="calendar icon" />&ensp;
                    <strong className="appBackgroundColor p-2">{ moment(arrivalTime).format("MMMM Do YYYY, h:mm:ss a") }</strong>
                    </div>

                    <img src="images/down-arrow.png" className="text-center" style={{ margin: "0px 40%" }} width="29px" alt="right arrow icon" />
                    
                    <div>
                    <img src="images/calendar.png" width="29px" alt="calendar icon" />&ensp;
                    <strong className="appBackgroundColor p-2">{ moment(departureTime).format("MMMM Do YYYY, h:mm:ss a") }</strong>
                    </div>
                </div>
            </div>


                <div className="bg-white p-3 mt-3">
                    <p className="d-flex justify-content-between"><strong>{ hoursStayed } hours { minutesStayed } minutes</strong><strong>{ priceToPay } MAD</strong></p>
                    <hr />
                    <p className="d-flex justify-content-between"><strong>Tax</strong><strong>0 %</strong></p>
                    <hr />
                    <p className="d-flex justify-content-between"><strong>Total</strong><strong>{ priceToPay } MAD</strong></p>
                </div>


                <div className="d-flex justify-content-center">
                <button type="submit" onClick={ handleSubmit } style={{ padding: "7px 40px", color: "#FFF" }} className={ hideSubmitBtn } role="button">Confirm booking</button>
                <img src="images/go-back.png" onClick={handleGoBackToQrCodePage} className={hideGoBackToQrCodeBtn} width="40px" alt="go to QR CODE" />
                </div>
                                
            
            
                
        </>
    )
}
