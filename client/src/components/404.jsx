import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (

        <div>
            <h1>Page Not Found</h1>
            <p>Error 404 !</p>
            <Link to="/signup">Home Page</Link>
        </div>
        
    )
}
