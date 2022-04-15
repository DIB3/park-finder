import React, { useState, useEffect } from 'react'
import LoginForm from './loginForm'
import { useHistory } from 'react-router-dom'
import { auth } from '../../firebase'
import LogoTitle from './logotitle'
import '../../css/login.css'
import '../../css/global.css'

export default function Index(props) {

    // state **
    let [error, setError] = useState("")
    let [alertStyleError, setAlertStyleError] = useState("alert alert-danger d-none")

    let history = useHistory()

    console.log('PROPS : ', props)

    useEffect(() => {
        let body = document.body
        body.classList.add('BackgroundStyle')
        auth.onAuthStateChanged((user) => {
            if(user){
                history.push('/slides') // /index
            }
        })

        if(props.location.state && props.location.state.Error === "OK"){
            setError("Sorry your account has been blocked please contact the administrator in order to resolve that")
            setAlertStyleError("alert alert-danger")
        }else{
            setError("")
            setAlertStyleError("alert alert-danger d-none")
        }
    }, [setError])


    


    return (
    <div id="container" className="d-flex justify-content-center"> 
            <div id="formulaire" className="col-10 col-xs-10 col-sm-10 col-md-4 col-lg-3 col-xl-3 mt-5">

                <LogoTitle />

                {/* Alerts */}
                <div className={ alertStyleError } role="alert"><strong>Account blocked !</strong> { error }</div>  

                <LoginForm />
            </div>
    </div>
    )
}
