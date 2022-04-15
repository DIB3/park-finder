import React, { useState } from 'react'
import { db, auth, googleAuthProvider, FacebookAuthProvider } from '../../firebase'
import { useHistory } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons'


   
export default function LoginForm() {
    
    //state
    const [state, setState] = useState({
        email: "",
        password: ""
    })
    let [error, setError] = useState("")
    let [alertStyleError, setAlertStyleError] = useState("alert alert-danger d-none")



    // use History
    let history = useHistory();

    // Login With Facebook Params ********
    // FacebookAuthProvider.addScope('my_secret_code')
    auth.languageCode = 'fr';
    FacebookAuthProvider.setCustomParameters({
        'display': 'popup'
    });
    // Login With Google Params
    googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    

 
    

    //handle user exist
    // check if the user exist if yes we add a user document to users collection in db firestore
    function checkUserExist(user){
        db.collection("users").where("uid", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            // boucle
            var userFound = false
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                console.log('user Found')
                if(doc){ // if user found
                    userFound = true
                }
            });
            
            if(userFound === false){ // if user found
                var userToAdd = {
                    uid: user.uid,
                    name: null,
                    email: user.email,
                    isbloqued: false,
                    isnew: true,
                    balance: 0
                }
                // Add a new user document with a generated id.
                var newUserRef = db.collection("users").doc(user.uid)
                newUserRef.set(userToAdd)
            }

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }





    //handle login with Facebook
    function handleFacebookLogin(e){
        e.preventDefault()
        auth.signInWithPopup(FacebookAuthProvider)
            .then((result) => {
                const user = result.user
                // const credential = result.credential
                // const accessToken = credential.accessToken
                // console.log('USER : ', user)

                // call the function checkUserExist
                checkUserExist(user)
            })
            .catch((error) => {
                console.log('signInWithPopup Error : ', error)
            });
    }



    //handle login with Google
    function handleGoogleLogin(e){
        e.preventDefault()
        auth.signInWithPopup(googleAuthProvider)
            .then((result) => {
                const user = result.user
                // var credential = result.credential;
                // const accessToken = credential.accessToken;

                // call the function checkUserExist
                checkUserExist(user)
            })
            .catch((error) => {
                // Handle Errors here.
                console.log('Error', error)
            });
    }



    // handleSubmit
    function handleSubmit(e){
        e.preventDefault()
        
        if(state.email !== "" && state.password !== ""){
            // SIGN IN
            auth.signInWithEmailAndPassword(state.email, state.password)
            .then(credentials => {
                // console.log("credentials", credentials.user)
                setError("")
                setAlertStyleError("alert alert-danger d-none")
                checkUserExist(credentials.user)
                history.push('/profil')
            })
            .catch(error => {
                // console.log("ERROR", error.message)
                setError(error.message)
                setAlertStyleError("alert alert-danger")
            })
        }else{
            setError("Please fill email and password fields to Log in!")
            setAlertStyleError("alert alert-danger")
        }
    }

    // handleChange
    function handleChange(e){
        const value = e.target.value
        setState({
            ...state,
            [e.target.name]: value
        })
    }



    return (
        <>
            <form className="form-signin" onSubmit={ handleSubmit }>
            

            {/* Alerts */}
            <div className={ alertStyleError } role="alert"><strong>Warning !</strong> { error }</div>   

            {/* FACEBOOK | GOOGLE sign in buttons */}
            <button id="btn-facebook" className="btn btn-large mt-2" onClick={ handleFacebookLogin }><FontAwesomeIcon style={{ marginRight: "5px" }} icon={faFacebook} /> Sign in with Facebook</button>
            <button id="btn-google" className="btn btn-large btn-light mt-2 mb-4" onClick={ handleGoogleLogin }><FontAwesomeIcon style={{ marginRight: "5px" }} className="mr-2" icon={faGoogle} />Sign in with Google</button>

            <div className="form-group">
            <label className="sr-only">Email address</label>
            <input
            type="email"
            name="email"
            className="form-control mb-2" 
            placeholder="Email address" 
            onChange={ handleChange }
            />
            </div>

            <div className="form-group">
            <label className="sr-only">Password</label>
            <input 
            type="password"
            name="password"
            className="form-control mb-2" 
            placeholder="Password" 
            onChange={ handleChange } />
            </div>


            <button 
            type="submit" 
            className="btn btn-block btn-primary mr-2">
            Login
            </button>
            
            <a href="/signup" style={{ marginLeft: "5px" }} className="btn btn-light btn-block ml-2" role="button">Sign up</a>
            <p className="text-center mt-4"><a href="resetpassword" className="text-white" target="_blank">Forget my password ?</a></p>
            </form>
        </>
    )
}