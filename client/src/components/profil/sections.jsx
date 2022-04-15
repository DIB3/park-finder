import React from 'react'
import '../../css/profil.css'
import { useHistory } from 'react-router-dom'

export default function Sections(props) {


    let history = useHistory()

    return (
        <div id="sections">
            <div onClick={ () => history.push('profil-details') } className="section">
                <img src="images/profil-icons/user-icon.png" width="32px" alt="user" />
                <h2 className="ml-4">My Profil</h2>
            </div>
            <div className="section">
                <img src="images/profil-icons/payment-icon.png" width="32px" alt="user" />
                <h2 className="ml-4">Payment process</h2>
            </div>
            <div className="section">
                <img src="images/profil-icons/legal-icon.png" width="32px" alt="user" />
                <h2 className="ml-4">Legal</h2>
            </div>
            <div className="section">
                <img src="images/profil-icons/options-icon.png" width="32px" alt="user" />
                <h2 className="ml-4">Options</h2>
            </div>
            <div className="section">
                <img src="images/profil-icons/help-icon.png" width="32px" alt="user" />
                <h2 className="ml-4">Help</h2>
            </div>
        </div>
    )
}
