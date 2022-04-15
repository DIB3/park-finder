import React, { useState, useEffect } from 'react'
import { Alert, Modal, Button } from 'react-bootstrap'
import { auth, db } from '../../firebase'


export default function Packs(props) {


    const [show, setShow] = useState(false)
    const [userId, setUserId] = useState("")
    const [userBalance, setUserBalance] = useState(0)
    const [balanceToAdd, setBalanceToAdd] = useState(20)
    const [pack, setPack] = useState("");


    const handleClose = () => setShow(false);

    const handleShow = (pack, value) => {
        setShow(true)
        setBalanceToAdd(value)
        setPack(pack)
    }


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user !== null){
                getUserBalance(user.uid)
                setUserId(user.uid) // set state userID
            }
        })
    }, [setUserBalance]);
    


    // function get user balance
    function getUserBalance(uid){
        console.log(uid)
        var docRef = db.collection("users").doc(uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                setUserBalance(doc.data().balance)
            }else{
                console.log('doc doesnt exist')
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    
    }
    


    // handleConfirm() if the user click confirm the balance increases
    function handleConfirm(e){
        e.preventDefault()

        var cityRef = db.collection('users').doc(userId)
        var updatebalance = userBalance + balanceToAdd
        // console.log(')))))))', updatebalance)
        cityRef.update({
            balance: updatebalance
        })
        .then(() => {
            console.log("Document successfully updated!");
            setUserBalance(updatebalance)
            let alert = document.querySelector('#alert-success')
            alert.classList.remove('d-none')
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        
        
    }


    return (
        <>
            <img src="images/piggy-bank.png" className="mt-4" width="80px" alt="balance icon" />
            <div id="global-balance" className="text-white">
                Balance :<strong className="ml-4">&ensp;{ userBalance } MAD</strong>
            </div>


            <h2 className="mt-3">Packs</h2>
            <small className="small text-secondary">Click on a pack in order to charge your balance</small>
            
            <div className="pack" onClick={() => handleShow("Basic", 20)}>
                Basic 20 MAD
            </div>
            <div className="pack" onClick={() => handleShow("Semi Pro", 50)}>
                Semi Pro 50 MAD
            </div>
            <div className="pack" onClick={() => handleShow("Pro", 100)}>
                Pro 100 MAD
            </div>
            <div className="pack" onClick={() => handleShow("Gold", 300)}>
                Gold 300 MAD
            </div>
            <div className="pack" onClick={() => handleShow("Diamond", 500)}>
                <img src="images/star-icon.png" className="ml-2" width="30px" alt="star icon" />
                Diamond 500 MAD
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                <Modal.Title>
                    <img src="images/piggy-bank.png" width="38px" alt="logo" />
                    &ensp; Charge Balance
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert id="alert-success" className="d-none" variant="success">
                        Your account is raised up succesfully your balance now is <strong>{ userBalance } MAD</strong> 
                    </Alert>
                    Hey! You have choose the <strong>{ pack }</strong> pack Please click on Confirm button below in order to increase your balance with <strong>{ balanceToAdd } MAD</strong> </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={(e) => handleConfirm(e)}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
