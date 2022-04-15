import React from 'react'
import '../../css/header.css'
import { useHistory } from 'react-router-dom'

export default function Header(props) {


    let history = useHistory()


    // handle history return icon click
    const handleHistory = (route, params = {}) => {
        history.push({
            pathname: route,
            state: params
        })
    }
    return (
        <div id="header">
            <img src="images/left-arrow.png" onClick={ () => handleHistory(props.route, props.params) } style={{ position: "absolute", left: "20px", top: "15px" }} width="28px" alt="return" />
        </div>
    )
}
