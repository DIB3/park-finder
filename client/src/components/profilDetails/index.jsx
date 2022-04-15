import React, { useState, useEffect } from 'react'
import { auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import Header from '../carte/header'
import '../../css/profil-details.css'


export default function Index() {


    //state
    const [user, setUser] = useState({})
    const [photoUrl, setPhotoUrl] = useState('images/user-icon.png')
    let history = useHistory()
    
    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        body.classList.add('BackgroundGrey')
        auth.onAuthStateChanged((user) => {
            // console.log("USER : ", user)
            if(user === null){
                history.push('/login')
            }else{
                setUser(user)

                if(user.photoURL !== null){
                    setPhotoUrl(user.photoURL)
                }else{
                    setPhotoUrl('images/user-icon.png')
                }
                
            }
        })
    })

    

    // handle Log Out
    function handleLogOut(){
        auth.signOut()
            .then(() => {
                history.push('/login')
            })
            .catch(error => {
                console.log("ERROR", error.message)
            })
    }

    return (
        <>
        <Header route="/profil" />
        <div className="container d-flex justify-content-center flex-wrap">
            <div style={{ width: "100%" }}>
            <h1 className="text-center mb-2 d-block p-2" style={{ marginTop: "100px" }}><img src="images/park-finder-logo.png" width="50px" alt="parkfinder logo" /> My Profil</h1>
            </div>

            { /* User profil image */ }
            <div id="user-image"><img src={ photoUrl } style={{ borderRadius: "130px" }} width="130px" alt="user" /></div>
            
            <div id="sections">
                <div className="section">
                    <img src="images/profil-icons/user-badge-icon.png" width="29px" alt="user icon" />
                    <strong className="text-dark" style={{ position: "absolute", top: "8px", left: "80px" }}>Name</strong>
                    <strong className="text-secondary" style={{ position: "absolute", top: "30px", left: "80px" }}>{ user.displayName }</strong>
                </div>
                <div className="section">
                    <img src="images/profil-icons/email-icon.png" width="29px" alt="user icon" />
                    <strong className="text-dark" style={{ position: "absolute", top: "8px", left: "80px" }}>Email</strong>
                    <strong className="text-secondary" style={{ position: "absolute", top: "30px", left: "80px" }}>{ user.email }</strong>
                </div>
                <div className="section">
                    <img src="images/profil-icons/lock-icon.png" width="29px" alt="user icon" />
                    <strong className="text-dark" style={{ position: "absolute", top: "8px", left: "80px" }}>Password</strong>
                    <strong className="text-secondary" style={{ position: "absolute", top: "30px", left: "80px" }}>****************</strong>
                </div>
                {/* <button style={{ padding: "10px 30px", borderRadius: "30px" }} className="btn appBackgroundColor btn-block mt-4">
                    <img src="images/profil-icons/pencil.png" width="20px" alt="edit profil icon" />
                    &ensp; Edit profil
                </button> */}
                <button style={{ margin: "0px 30px", padding: "10px 35px", borderRadius: "30px"}} className="btn appBackgroundColor mt-2" onClick={handleLogOut}>
                    <img src="images/logout.png" width="20px" alt="logout icon" />&ensp;
                    Sign out
                </button>
            </div>


        </div>
       
        </>
    )
}
