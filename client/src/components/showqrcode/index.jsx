import React, { useState, useEffect } from 'react'
import Header from '../carte/header'

export default function Index(props) {

    const [qrimage, setQrimage] = useState("")
    const [bookingId, setBookingId] = useState("")

    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')
        setQrimage(props.location.state.qrimage)
        setBookingId(props.location.state.bookingId)
        console.log('SATATE : ', props.location)

    }, [setQrimage, setBookingId])


    return (
        <>
        <Header route="/index" />
        <div className="container d-flex justify-content-center flex-wrap">
            <h1 className="text-center" style={{ marginTop: "100px", marginLeft: "100px", marginRight: "100px"}}>QR code</h1>
            
            <strong className="mt-3">ID : #EF38{bookingId}</strong>
            <a href={qrimage} download><img src={qrimage} className="mt-4" width="250px" alt="qr code" /></a>
        </div>
        </>
    )
}
