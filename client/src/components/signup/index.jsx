import React from 'react'
import SignupForm from './signupForm'
import '../../css/global.css'
import '../../css/signup.css'


function Signup() {


   
    return (
        <>
            {/* <Navbar /> */}
            <div id="container" className="d-flex justify-content-center">

                    <div className="col-10 col-xs-10 col-sm-10 col-md-4 col-lg-3 col-xl-3 mt-5">
                        
                        <SignupForm />
                        
                    </div>

            </div>
        </>
    )
}


export default Signup