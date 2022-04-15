import React from 'react'


export default function Balance(props) {


    return (
        <>
            <img src="images/piggy-bank.png" className="mt-5" width="80px" alt="balance icon" />
            <div id="global-balance">
                Balance<strong className="ml-4">&ensp;{ props.userbalance } MAD</strong>
                
            </div>
        </>
    )
}
