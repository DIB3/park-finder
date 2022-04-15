import React, { useState, useEffect } from 'react'
import NavigationBar from '../carte/navigation-barre'
import Header from '../carte/header'
import { useHistory } from 'react-router-dom'
import { db, auth } from '../../firebase'
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import '../../css/global.css' 
import '../../css/voiture.css' 



export default function Index() {

   const [spot, setSpot] = useState(1)
   const [user, setUser] = useState({})
   const [detection, setDetection] = useState(0)
   const [parking, setParking] = useState([])
   const [npl, setNpl] = useState(0)
   const [npo, setNpo] = useState(0)
   const [carStyle, setCarStyle] = useState("d-block")

   const handleChangeSpot = (floor) => setSpot(floor)
 
   let history = useHistory()


    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')

        auth.onAuthStateChanged((user) => {
            if(user === null){
                history.push('/login')
            }
                
            setUser(user)
            handleGetParkingsPlaces()


            // // get data from arduino each 6 seconds
            // setInterval(() => {
            //     getDataFromArduinoWithAxios()
            //     console.log('Detection', detection)

            //    detection === 1 ? setCarStyle("d-block") : setCarStyle("d-none")

            // }, 4000);
            
            console.log('NPO : ', npo)
            console.log('NPL : ', npl)

        })

        return ( () => {
            // console.log(‘cleanup on change of player props’);
           
            //setDetection(99)
        });

    }, [setDetection]);



    function getDataFromArduinoWithAxios(){
        // Make a request for a user with a given ID
         const url = "http://169.254.16.243/"
         const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
         }
         axios.get(url, headers)
         .then(function (response) {
            // handle success
            console.log(response);
            setDetection(response.data.detection)
         })
         .catch(function (error) {
            // handle error
            console.log(error);
         })
    }




   function handleGetParkingsPlaces(){
        var docRef = db.collection("parkings").doc("XUk1i6WCytNz4bCpdDx7");
        docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            setParking(doc.data())
            setNpl(doc.data().npl)
            setNpo(doc.data().npo)
        } else {
        // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
   }




   if(spot === 1){
      return(
         <>
            <Header route='/index' />
            <div className="d-flex justify-content-center" style={{ marginTop: "75px" }}>
               <Spinner animation="grow" width="19px" />&ensp;
               <em className="text-dark mt-2">View in Realtime</em>
            </div>
            <div className="button-tab mt-4 d-flex justify-content-around">
               <button onClick={() => handleChangeSpot(1)} className="btn btn-outline-primary appBackgroundColor">1st Floor</button>
               <button onClick={() => handleChangeSpot(2)} className="btn btn-outline-secondary appBackgroundColor"> 2nd Floor</button>
               <button onClick={() => handleChangeSpot(3)} className="btn btn-outline-dark appBackgroundColor">3rd Floor</button>
   
            </div>


         <div className ="container container-fluid mt-5">

            <div className="t"></div>
            
            <div className="Espace3 mt-3">
            <div className="box1 mb-4">  
         <ul>
            <li>
               <div className="timeline1-content">
               <img src="images/voiture.png" className={carStyle} alt="car" width="50px"  />
               <h3>A1</h3>
               </div>
            </li>
         <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <h3>A2</h3>
               </div>
            </li>
            <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>A3</h3>
               </div>
            </li>
            <hr></hr>

            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>A3</h3>
               </div>
            </li>
            </ul> 
         </div> 



         <div className="box1 mb-4">  
         <ul>
            <li>
               <div className="timeline1-content">
               <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>A1</h3>
               </div>
            </li>
         <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <h3>A2</h3>
               </div>
            </li>
            <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>A3</h3>
               </div>
            </li>
            <hr></hr>

            <li>
               <div className="timeline1-content">
               
               <h3>A3</h3>
               </div>
            </li>
            </ul> 
         </div> 

</div>

      




</div>
         <NavigationBar />
         </>
      )
   }else if(spot === 2){
      return(
         <>
            <Header route='/index' />
            <div className="d-flex justify-content-center"><Spinner animation="grow" style={{ marginTop: "75px" }}/></div>
            <div className="button-tab mt-4 d-flex justify-content-around">
               <button onClick={() => handleChangeSpot(1)} className="btn btn-outline-primary appBackgroundColor">1st Floor</button>
               <button onClick={() => handleChangeSpot(2)} className="btn btn-outline-secondary appBackgroundColor"> 2nd Floor</button>
               <button onClick={() => handleChangeSpot(3)} className="btn btn-outline-dark appBackgroundColor">3rd Floor</button>
   
            </div>


            <div className ="container container-fluid mt-5">
               <div className="t"></div>
               
               <div className="Espace3 mt-3">
         <div className="box1">   <ul>
            <li>
               <div className="timeline1-content">
               <h3>C1</h3>
               
               </div>
            </li>
         <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>C2</h3>
               </div>
            </li>
            <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>C3</h3>
               </div>
            </li>
            <hr></hr>

            <li>
               <div className="timeline1-content">
               
               <h3>C4</h3>
               </div>
            </li>
            </ul>
         </div>



         <div  className="box1">  <ul>
            <li>
               <div className="timeline1-content">
                  <img src="images/voiture.png" alt="car" width="50px"  />
               <h3>C1</h3>
               
               </div>
            </li>
         <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>C2</h3>
               </div>
            </li>
            <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>C3</h3>
               </div>
            </li>
            <hr></hr>

            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>C4</h3>
               </div>
            </li>
            </ul> </div> 

</div>

        
  



 </div>
            <NavigationBar />
            </>
        )
    }else{
        return(
            <>
            <Header route='/index' />
            <div className="d-flex justify-content-center"><Spinner animation="grow" style={{ marginTop: "75px" }}/></div>
             <div className="button-tab mt-4 d-flex justify-content-around">
                 <button onClick={() => handleChangeSpot(1)} className="btn btn-outline-primary appBackgroundColor">1st Floor</button>
                 <button onClick={() => handleChangeSpot(2)} className="btn btn-outline-secondary appBackgroundColor"> 2nd Floor</button>
                 <button onClick={() => handleChangeSpot(3)} className="btn btn-outline-dark appBackgroundColor">3rd Floor</button>
   
             </div>


             <div className ="container container-fluid mt-5">
                 <div className="t"></div>
                 
                 <div className="Espace3 mt-3">
           <div className="box1">   <ul>
            <li>
               <div className="timeline1-content">
                  <img src="images/voiture.png" alt="car" width="50px" />
               <h3>B1</h3>
               
               </div>
            </li>
           <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B2</h3>
               </div>
            </li>
            <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B3</h3>
               </div>
            </li>
            <hr></hr>

            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B4</h3>
               </div>
            </li>
            </ul>
           </div>



           <div  className="box1">  <ul>
            <li>
               <div className="timeline1-content">
                               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B1</h3>
               
               </div>
            </li>
           <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B2</h3>
               </div>
            </li>
            <hr></hr>
            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B3</h3>
               </div>
            </li>
            <hr></hr>

            <li>
               <div className="timeline1-content">
               
               <img src="images/voiture.png" width="50px" alt="car" />
               <h3>B4</h3>
               </div>
            </li>
            </ul> </div> 

</div>

       
 



</div>
           <NavigationBar />
           </>
        )
    }
};