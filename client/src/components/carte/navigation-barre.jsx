import React from 'react'
import '../../css/navigation-barre.css'

export default function NavigationBar() {


    return (
        <>
            <div id="navigation-barre">
                <div className="icons"><a href="/index"><img src="images/park-finder-logo.png" alt="home" width="42px" /></a></div>
                <div className="icons"><a href="/carte"><img src="images/maps.png" alt="maps" width="38px" /></a> </div>
                
                <div className="icons"><a href="/solde"><img src="images/balance.png" alt="solde" width="32px" /></a></div>
                <div className="icons"><a href="/profil"><img src="images/user-icon.png" alt="user" width="35px" /></a></div>
            </div>
        </>
    )
}
