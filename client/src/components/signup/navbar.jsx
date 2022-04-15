import React from 'react'
import '../../css/global.css'
import '../../css/signup.css'
import { Link } from 'react-router-dom'

function Navbar() {

    return (
        <div>
            <nav className="navbar navbar-light gradien-color">
                <Link to="/" className="navbar-brand ml-2">
                    <img src="images/home-icon.png" style={{ marginLeft: "20px" }} width="35" className="d-inline-block align-top" alt="home-icon" />
                </Link>
            </nav>
        </div>
    )
}


export default Navbar