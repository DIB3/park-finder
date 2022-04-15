import React, { useState, useEffect } from 'react';
import { Grid,Paper, TextField, Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { auth } from '../../firebase'
import { useHistory } from 'react-router-dom'
import Header from '../carte/header'
import NavigationBar from '../carte/navigation-barre'


const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
      width: 200,
    },
  }));


export default function Index(props) {

    const paperStyle = {padding :50, minHeight:'150px', width:300, margin:"0 auto"}
    let history = useHistory()

    //state
    const [state, setState] = useState({
        car_number: "",
        arrival_time: 0,
        departure_time: 0
    })

    const classes = useStyles();
    const [user, setUser] = useState({})
    let [error, setError] = useState("")
    let [alertStyleError, setAlertStyleError] = useState("alert alert-danger d-none")



    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        // console.log('props', props.location.state.parkingId)

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }

            if(props.location.state === undefined){
                 history.push('/parkings')
            }
            console.log('props : ', props)
            setUser(user) // add user object to user state
        })

    }, [])


    
    // handleChange
    function handleChange(e){
        const value = e.target.value
        setState({
            ...state,
            [e.target.name]: value
        })
        // console.log('State : ', state)
    }



    // handle Submit *******************
    function handleSubmit(e){
        e.preventDefault()
        if(state.car_number !== "" && state.arrival_time !== ""){
            // console.log('State : ', state)
            
            var datenow = Date.now()
            var arrivalDateString = state.arrival_time
            var departureDateString = state.departure_time
            var arrival_timestamp = Date.parse(arrivalDateString) // renvoie le chiffre date converter en milliseconds
            var departure_timestamp = Date.parse(departureDateString)

            console.log('arrival_timestamp', arrival_timestamp)
            console.log('departure_timestamp', departure_timestamp)

            
            console.log('Arrival Date Time', state.arrival_time)
            if(datenow < arrival_timestamp){

                if(arrival_timestamp < departure_timestamp){
                    console.log('booking accepted')
                    // Add a new document with a generated id.
                    const bookingToAdd = {
                        uid: user.uid,
                        bookingDate: datenow,
                        parkingId: props.location.state.parkingId,
                        carNumber: state.car_number,
                        arrivalTime: arrival_timestamp,
                        departureTime: departure_timestamp,
                        finished: false
                    }

                    history.push({
                        pathname: '/bookingdetails',
                        state: { bookingToAdd: bookingToAdd }
                    })
                    

                    
                }else{
                    setError("The departure time is inferior to arrival time")
                    setAlertStyleError("alert alert-danger")
                }

            }else{
                setError("Please choose a valid arrival date")
                setAlertStyleError("alert alert-danger")
            }

        }else{
            setError("The car number and arrival time fields are required")
            setAlertStyleError("alert alert-danger alert-dismissible fade show")
        }
        
        
    }



    // handle Close Alert
    function handleCloseAlert(){
        setError("")
        setAlertStyleError("alert alert-danger d-none")
    }
  

    return (
        <>
            <Header route='/parkings' />
            
            <div className="container header text-center">
            <h2 className="text-center" style={{ marginTop: "100px" }}>Booking form</h2>

            <form className={classes.container} noValidate>

                {/* Alerts */}
                <div className={ alertStyleError } role="alert"><strong>Warning ! </strong> 
                    { error }
                    <button type="button" onClick={handleCloseAlert} className="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>


            <Grid>
                <Paper className="mt-3" style={paperStyle}>
                    <Grid align="center">
                    <img src="images/car.png" className="mb-3" alt="street logo" width="90px" />
                        
                    </Grid>
                    

                    <Grid container justify="space-around">
                        <TextField label='Car number' className="mb-2" name="car_number" onChange={ handleChange } placeholder='Car number' required/>
                    </Grid>

                    <Grid container justify="space-around">
                        <TextField
                            id="datetime-arrival"
                            label="Arrival time"
                            type="datetime-local"
                            name="arrival_time"
                            className="mb-4"
                            defaultValue="0000-00-00T00:00"
                            onChange={ handleChange }
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid container justify="space-around">
                        <TextField
                            id="datetime-departure"
                            label="Departure time"
                            type="datetime-local"
                            defaultValue="0000-00-00T00:00"
                            name="departure_time"
                            onChange={ handleChange }
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </Grid>
                    


                    <Button type='submit' onClick={ handleSubmit } variant="contained" className="text-white appBackgroundColor" fullWidth>Booking</Button>
                </Paper>
            </Grid>
            </form>
            </div>

            <NavigationBar/>
        </>
    )
}
