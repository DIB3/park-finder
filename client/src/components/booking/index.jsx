import React, {useEffect} from 'react'

export default function Index() {


    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')
        // console.log('props', props.location.state.parkingId)
    }, [])

    
    return (
        <div>
            <h1>Je suis la page index (Reservation)</h1>
        </div>
    )
}
