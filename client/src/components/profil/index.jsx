import React, { useEffect } from 'react'
import { auth } from '../../firebase'
import NavigationBar from '../carte/navigation-barre'
import { useHistory } from 'react-router-dom'
import Sections from './sections'
import Header from '../carte/header'


export default function Index() {

    let history = useHistory()
    
    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')
        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }
        })
    })


    return (
        <>
        <Header route="/index" />
        <div className="container">
            <h1 className="text-center mb-3" style={{ marginTop: "100px" }}><img src="images/park-finder-logo.png" width="50px" alt="parkfinder logo" /> My Account</h1>
            <Sections />
            
        </div>
        <NavigationBar />
        </>
    )
}
