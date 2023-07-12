import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, generateId, IonAlert
} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// import RegisterDoctor from "./RegisterDoctor"

/* Theme variables */
import '../theme/variables.css';
// import './Admin.css';
import { useState, useRef, useEffect } from "react";
// import { useStorageFillingRemarks } from '../../hooks/useStorageFillingRemarks';
import {Redirect} from "react-router";
import Cookie from'universal-cookie';

import ShowAlert from '../components/ShowAlert';

import * as apis from '../api/Api';

// setupIonicReact();

const Home: React.FC = () => {
    // const patientIdRef = useRef<HTMLIonInputElement>(null);
    // const [task, setTask] = useState('');
    const [role, setRole] = useState("");
    const userId = useRef<HTMLIonInputElement>(null);
    const otp = useRef<HTMLIonInputElement>(null);
    // const [valid, setValid] = useState(false);
    const [mobileNo, setMobileNo] = useState("");
    const [auth, setAuth] = useState(true);
    const [on, setOn] = useState(false);

    const [otpGen, showOtpGen] = useState(false);
    const [invalidOtp, showInvalidOtp] = useState(false);
    const [invalidId, showInvalidId] = useState(false);

    const [userData, setUserData] = useState();

    useEffect(() => {
        setAuth(false);
    }, []);

    const handleChange = (event: any) => {
        setRole(event.target.value);
        // console.log(event.target.value);
    }

    const generate = () => {
        fetch(`${apis.API_BASE}/${role}/phoneNo/${userId.current!.value}`)
            .then(function (response) {
                // console.log(response.text());
                if (response['status'] === 200) {
                    console.log("Found entry");
                    showInvalidId(false);
                    return response.text();
                }
                else {
                    showInvalidId(true);
                    console.log("No such entry..!");
                    return "-1";
                }
            })
            .then(function (data) {
                console.log(data);
                if(data === "-1"){
                    console.log("Try again..!");
                }
                else{
                    setMobileNo(data);
                    fetch(`${apis.JWT_REQ_OTP}/${data}`)
                        .then(function (response) {
                                console.log(response.json());
                                if (response['status'] === 200) {
                                    console.log("OTP Sent to Registered Mobile Number");
                                    showOtpGen(true);
                                }
                                else {
                                    console.log("Please Enter a valid Phone Number");
                                    showOtpGen(false);
                                }
                            }
                        )}})
    }

    const authenticate = () => {
        // setAuth(true);
        let data = {
            "phoneNo": mobileNo,
            "otp": otp.current!.value
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(`${apis.JWT_VERIFY_OTP}`, options)
            .then(function (response) {
                if (response['status'] === 200) {
                    showInvalidOtp(false);
                    return response.json()
                }
                else {
                    console.log("OTP mismatch Sorry..!");
                    showInvalidOtp(true);
                    setAuth(false);
                    return "-1";
                }
            })
            .then(function(data) {
                if(data != -1) {
                    const cookie = new Cookie();
                    console.log(data.jwt)
                    cookie.set("jwt", data.jwt)
                    
                    fetch(`${apis.API_BASE}/${role}/${userId.current!.value}`, {headers : {Authorization: 'Bearer '+cookie.get("jwt")}})
                    .then(function (response) {
                        if(response.status !== 200 && response.status !== 201)
                            showInvalidOtp(true);
                        else
                            showInvalidOtp(false);

                        return response.json();
                    })
                    .then((data) => {
                        setUserData(data);
                        console.log("OTP Validated");
                        setAuth(true);
                    })
                }
            })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>HEALTH CARE SERVICES</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>LOGIN PAGE</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding back'/*class = "content-style"*/>

                <IonGrid className='ion-text-center ion-margin'>

                    <IonList className="ion-select-style">
                        <IonItem>
                            <IonSelect interface="action-sheet" placeholder="LOGIN AS" onIonChange={handleChange}>
                                <IonSelectOption value="admin">ADMIN</IonSelectOption>
                                <IonSelectOption value="supervisors">SUPERVISOR</IonSelectOption>
                                <IonSelectOption value="doctorInHospital">DOCTOR</IonSelectOption>
                                {/* <IonSelectOption value="fieldWorkerInHospital">FIELD WORKER</IonSelectOption> */}
                            </IonSelect>
                        </IonItem>
                    </IonList>

                    <IonSegment>
                        <form className="ion-padding">
                            <IonItem>
                                <IonLabel position="floating">ID</IonLabel>
                                <IonInput ref={userId} />
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={() => generate()}>
                                GENERATE OTP
                            </IonButton>
                            <IonItem>
                                <IonLabel position="floating">OTP</IonLabel>
                                <IonInput ref={otp} type="password" />
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={() => authenticate()}/*routerLink = {`./${role}`}*/>
                                Login
                            </IonButton>

                            {auth ?
                                <Redirect to={{ pathname: `./${role}`, state: { userData: userData } }}/>
                            :null}
                        </form>
                    </IonSegment>

                </IonGrid>

                {/* alerts: */}
                <ShowAlert alert = {otpGen} showAlert = {showOtpGen} headAlert = "Success" msgAlert = "OTP sent on your registered Mobile Number." onIonChange = {() => {showOtpGen(false)}}></ShowAlert>
                <ShowAlert alert = {invalidOtp} showAlert = {showInvalidOtp} headAlert = "Incorrect OTP" msgAlert = "Please try again." onIonChange = {() => {showInvalidOtp(false)}}></ShowAlert>
                <ShowAlert alert = {invalidId} showAlert = {showInvalidId} headAlert = "Incorrect ID" msgAlert = "Please try again." onIonChange = {() => {showInvalidOtp(false)}}></ShowAlert>

            </IonContent>
        </IonPage>
    )
};

export default Home;