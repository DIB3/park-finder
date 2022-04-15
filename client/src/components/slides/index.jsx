import React, { useState, useEffect } from 'react'
import { db, auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import SlideOne from './slideone'
import SlideTwo from './slidetwo'
import SlideThree from './slidethree'

export default function Index() {

    const [next, setNext] = useState(1)
    const [userId, setUserId] = useState(1)

    let history = useHistory()

    let body = document.body
    body.classList.remove('BackgroundStyle')
    body.classList.add('BackgroundGrey')

    useEffect(() => {
        console.log('Next : ', next )

        auth.onAuthStateChanged((user) => {
            if(user !== null){
                setUserId(user.uid)
                // check if the user is new
                var docRef = db.collection("users").doc(user.uid);
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        if(doc.data().isnew === false){
                            history.push('/index')
                        }
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }
        })

    }, [userId])


    // update isnew attr
    function handleSetNewAttr(){
        var userRef = db.collection("users").doc(userId);
        // Set the "isnew" field of the city 'false'
        userRef.update({
            isnew: false
        })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    function handleClick(){
        setNext((previousNext) => previousNext + 1)
        console.log('Next : ', next)
        if(next === 3){
            handleSetNewAttr()
            // change isnew attr
            history.push('/index') // redirection
        }
    }

    if(next === 1){
        return (
            <div className="container col-11">
            <div onClick={handleClick} className="mt-5 d-flex justify-content-end"><img src="images/next-arrow.png" width="33px" alt="next arrow" /></div>
            <SlideOne />
            </div>
        )
    }else if(next === 2){
        return (
            <div className="container col-11">
            <div onClick={handleClick} className="mt-5 d-flex justify-content-end"><img src="images/next-arrow.png" width="33px" alt="next arrow" /></div>
            <SlideTwo />
            </div>
        )
    }else{
        return (
            <div className="container col-11">
            <div onClick={handleClick} className="mt-5 d-flex justify-content-end"><img src="images/next-arrow.png" width="33px" alt="next arrow" /></div>
            <SlideThree />
            </div>
        )
    }
    
}
