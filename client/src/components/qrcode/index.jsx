import React, {useState, useEffect} from 'react'
import QRcode from 'qrcode'
import { db, auth } from '../../firebase'
import Header from '../carte/header'
import { useHistory } from 'react-router-dom'
import emailjs from 'emailjs-com'
import NavigationBar from '../carte/navigation-barre'



export default function Index(props) {

    const [bookingInfos, setBookingInfos] = useState({})
    const [docRef, setDocRef] = useState("")
    const [qrImage, setQrImage] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [priceToPay, setpriceToPay] = useState(0)

    let [success, setSuccess] = useState("")
    let [alertStyleSuccess, setAlertStyleSuccess] = useState("alert alert-success d-none")

    let history = useHistory()



    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')
        

        console.log('props', props.location) // console ***

        if(props.location.state.docRef === undefined){
            history.push('/bookingdetails')
        }

        // setstate
        setBookingInfos(props.location.state.bookingToAdd)
        setpriceToPay(props.location.state.priceToPay)
        setDocRef(props.location.state.docRef)

        
        // const myarray = [bookingInfos] // pass my object inside an array
        QRcode.toDataURL(props.location.state.docRef)
        .then(url => {
            setQrImage(url)
            console.log('URL : ', url)

            // ADD QR CODE IMAGE TO A BDD
            var bookingRef = db.collection("bookings").doc(props.location.state.docRef)
            var setWithMerge = bookingRef.set({
                qrimage: url
            }, { merge: true });

            setWithMerge
            .then(() => {
                console.log("Document successfully updated!")
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

        })
        .catch(err => {
            console.log('ERROR : ', err)
        })

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }

            setUserEmail(user.email) // setstate

        })


        console.log('Props : ', props.location.state)

    }, [setBookingInfos])




    //handle Send Email 
    function handleSendEmail(e){
        e.preventDefault()
        emailjs.sendForm('service_r4zleut', 'template_7gpr9wr', e.target, 'user_VZapoZx7cE0Ccs1uVJSQd')
        .then((result) => {
            console.log(result.text);
            if(result.text === "OK"){
                console.log("email send succesfully !")
                setSuccess( "The email sent successfully! please check you email in order to check your booking details Thank you" )
                setAlertStyleSuccess( "alert alert-success" )
            }
        }, (error) => {
            console.log(error.text);
        });
    }



    // handle Close Alert
    function handleCloseAlert(){
        setSuccess("")
        setAlertStyleSuccess("alert alert-success d-none")
    }


    return (
        <>
        <Header route='/bookingdetails' params={{ bookingToAdd: bookingInfos, docRef: docRef, return: true }} />

        <div className="container">
        <div>
            <h1 className="text-center mb-2" style={{ marginTop: "100px", position: "relative", top: "-10px" }}>Booking QR CODE</h1>
        </div>

        {/* Alerts */}
        <div className={ alertStyleSuccess } role="alert"><strong>Success !</strong> 
            { success }
            <button type="button" onClick={handleCloseAlert} className="close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>



        <div className="container d-flex justify-content-center">
            <img src={qrImage} className="mt-4" width="250px" alt="QR code" />
        </div>

        
        <form action="" onSubmit={ handleSendEmail }>
            <input type="text" className="d-none" name="from_name" value="Park Finder Team" />
            <input type="text" className="d-none" name="userEmail" value={userEmail} />
            <input type="text" className="d-none" name="orderid" value={ docRef } />
            <input type="text" className="d-none" name="priceToPay" value={ priceToPay } />
            <input type="text" className="d-none" name="carnumber" value={ bookingInfos.carNumber } />
            <input type="text" className="d-none" name="qrimage" value={ qrImage } />
            <div className="container d-flex justify-content-center">
                <button type="submit" style={{ padding: "7px 40px", color: "#FFF" }} className="btn btn-block appBackgroundColor mt-4" role="button">Get booking details via email</button>
            </div>
        </form>

        
        </div>

        <NavigationBar/>
        </>
    )
}
