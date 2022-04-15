import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import'bootstrap/dist/css/bootstrap.min.css';
//PAGES
import DashboardPage from './components/dashboard/index'
import LoginPage from './components/login/index'
import SignupPage from './components/signup/index'
import CartePage from './components/carte/index'
import BookingPage from './components/booking/index'
import BookingFormPage from './components/bookingForm/index'
import SoldePage from './components/solde/index'
import ProfilPage from './components/profil/index'
import ProfilDetailsPage from './components/profilDetails/index'
import ResetPasswordPage from './components/resetPassword/index'
import SlidesPage from './components/slides/index'
import ParkingsPage from './components/parkings/index'
import ParkingSpot from './components/parkingSpot/index'
import BookingDetailsPage from './components/bookingDetails/index'
import ShowQrCodePage from './components/showqrcode/index'
import AllBookingsPage from './components/allBookings/index'
import QRcode from './components/qrcode/index'

import NotFoundPage from './components/404'


export default function App() {
  
  return (
    <div>
        <Router>
            <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/index" component={DashboardPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignupPage} />
                <Route exact path="/profil" component={ProfilPage} />
                <Route exact path="/profil-details" component={ProfilDetailsPage} />
                <Route exact path="/solde" component={SoldePage} />
                <Route exact path="/booking" component={BookingPage} />
                <Route exact path="/bookingform" component={BookingFormPage} />
                <Route exact path="/bookingdetails" component={BookingDetailsPage} />
                <Route exact path="/resetpassword" component={ResetPasswordPage} />
                <Route exact path="/carte" component={CartePage} />
                <Route exact path="/slides" component={SlidesPage} />
                <Route exact path="/parkings" component={ParkingsPage} />
                <Route exact path="/qrcode" component={QRcode} />
                <Route exact path="/parkingSpot" component={ParkingSpot} />
                <Route exact path="/showqrcode" component={ShowQrCodePage} />
                <Route exact path="/allbookings" component={AllBookingsPage} />

                <Route exact path="/404" component={NotFoundPage} />
                <Redirect to="/404" />
            </Switch>
        </Router>
    </div>
  );
}
