import React from 'react'
import { auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import NavigationBar from '../carte/navigation-barre'
import Packs from './packs'
import '../../css/solde.css'


export default function Index() {

    
    let history = useHistory()
    let body = document.body
    body.classList.remove('BackgroundStyle')

    auth.onAuthStateChanged((user) => {
        if(user === null){
            history.push('/login')
        }
    })
    
    

    
    return (
        <>
            
            <div className="container d-flex justify-content-center">
                <div id="balances">
                    
                    <Packs />
                </div>
            </div>

            <NavigationBar />
        </>
    )
}
