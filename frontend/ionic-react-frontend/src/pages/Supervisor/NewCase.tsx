import {
    IonPage,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton, IonAlert, IonGrid, IonRow
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

// import Date from "../items/Date";

/* Theme variables */
import '../../theme/variables.css';
import './Supervisor.css';
import React, {useRef, useState} from "react";
import {Redirect} from "react-router";
import BackButton from "../../components/BackButton";
import {API_ACTIVE_VIS, API_GET_ALL_DOCINHOSP, API_OTP_GEN, API_OTP_VERIFY, API_PATIENT, API_VIS} from "../../api/Api";
import Cookies from 'universal-cookie';

// setupIonicReact();

const NewCase:React.FC<any> = props=> {
    const cookie = new Cookies();
    const patientIdRef = useRef<HTMLIonInputElement>(null);
    const profile = props.location.state;
    const [profileData, setProfileData] = useState(profile);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertErr, setShowAlertErr] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showAlertCase, setShowAlertCase] = useState(false);
    const [showAlertCaseErr, setShowAlertCaseErr] = useState(false);
    const otp = useRef<HTMLIonInputElement>(null);
    const [mobileNo, setMobileNo] = useState("");

    const [auth, setAuth] = useState(true);



    const path="/supervisors"

    const loginPatient = async() => {


        fetch(`${API_PATIENT}/phoneNo/${patientIdRef.current!.value}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(function (response) {
                // console.log(response.text());
                if (response['status'] === 200) {
                    console.log("Found entry");
                    return response.text();
                }
                else if(response['status'] === 401)
                    setAuth(false);
                else {
                    console.log("No such entry..!");
                }
                return "-1";
            })
            .then(async function (data) {
                console.log(data);
                if(data === "-1"){
                    console.log("Try again..!");
                }
                else{
                    setMobileNo(data);
                    fetch(`${API_OTP_GEN}/${data}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
                        .then(async function (response) {
                                const result = await response;
                                console.log(response);
                                if(result['status'] === 200){
                                    console.log("DONE");
                                    setLoginSuccess(true);
                                    setShowAlert(true);
                                    setShowAlertErr(false);
                                }
                                else if(response['status'] === 401)
                                    setAuth(false);
                                else{
                                    console.log("ERROR");
                                    setLoginSuccess(false);
                                    setShowAlert(false);
                                    setShowAlertErr(true);
                                }
                            }
                        )}
            })
    }

    const createCase = async() => {

        fetch(`${API_OTP_VERIFY}/${otp.current!.value}/${mobileNo}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(async function (response) {
                    console.log(response);
                    if (response['status'] === 200) {

                        await fetch(`${API_GET_ALL_DOCINHOSP}/${profileData?.userData?.hospital?.hospitalId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
                            .then(function (response) {
                                console.log(response);
                                if (response['status'] === 200) {
                                    console.log("DONE");
                                    return response.json();
                                } 
                                else if(response['status'] === 401)
                                    setAuth(false);
                                else {
                                    console.log("ERROR");
                                }
                                return "-1";
                                
                            })
                            .then(function (data){
                                if(data !== "-1"){
                                    let curr_doctor;
                                    let min_patients = 1e9;
                                    let docInHospId;
                                    (async function(){
                                        for(curr_doctor of data){
                                            const hospitalId = profileData?.userData?.hospital?.hospitalId
                                            const currId = curr_doctor.docInHospId
                                            await fetch(`${API_ACTIVE_VIS}/${hospitalId}/docInHosp/${currId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
                                                .then(function (response){
                                                    console.log(response);
                                                    if (response['status'] === 200) {
                                                        console.log("DONE");
                                                    } else {
                                                        console.log("ERROR");
                                                    }
                                                    return response.json();
                                                })
                                                .then(async function (data){
                                                    if(data.length<min_patients){
                                                        min_patients = await data.length
                                                        docInHospId = await currId
                                                    }

                                                })
                                        }
                                        return docInHospId
                                    })().then(async function (docInHospId){
                                        let dto = {
                                            'hospital':{'hospitalId': profileData?.userData?.hospital?.hospitalId},
                                            'patient':{'patientId': patientIdRef.current!.value},
                                            'doctorInHospital':{'docInHospId':docInHospId}
                                        };
                                        console.log(JSON.stringify(dto));
                                        const addRecordEndpoint = `${API_VIS}/`;
                                        const options = {
                                            method: 'POST',
                                            headers:{
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer '+cookie.get("jwt")
                                            },
                                            body: JSON.stringify(dto)
                                        }

                                        const response = await fetch(addRecordEndpoint, options);
                                        const result = await response;
                                        console.log(response);
                                        if(result['status'] === 200){
                                            console.log("DONE");
                                            setShowAlertCase(true);
                                            setShowAlertCaseErr(false);
                                            setRedirect(true);
                                        }

                                        else{
                                            console.log("ERROR");
                                            setShowAlertCaseErr(true);
                                            setShowAlertCase(false);
                                            setRedirect(false);
                                        }
                                    })
                                }
                            })

                    }
                    else {
                        console.log("OTP mismatch Sorry..!");
                    }
                }
            )

    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>HEALTHCARE SERVICES</b>
                    </IonTitle>
                </IonToolbar>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>SUPERVISOR</b>
                    </IonTitle>
                </IonToolbar>
                <IonRow>
                    <BackButton path={path} data={profileData.userData}></BackButton>
                </IonRow>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>NEW CASE</b>
                    </IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent className='ion-padding'/*class = "content-style"*/>
                <IonGrid className='ion-text-center ion-margin'>
                    <IonCard class = "card-style">
                        <IonCardHeader>
                            <IonCardTitle>PATIENT ID: </IonCardTitle>
                            <IonCardTitle><IonInput ref = {patientIdRef} class = "card-input" type = "number" placeholder="1234"></IonInput></IonCardTitle>
                        </IonCardHeader>
                    </IonCard>

                    <IonButton onClick = {loginPatient}>Send OTP</IonButton>

                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => setShowAlert(false)}
                        header="Alert"
                        subHeader="OTP SENT TO THE REGISTERED MOBILE NUMBER"
                        message="Please verify the OTP"
                        buttons={['OK']}
                    />

                    <IonAlert
                        isOpen={showAlertErr}
                        onDidDismiss={() => setShowAlertErr(false)}
                        header="Alert"
                        subHeader="No such ID FOUND..!"
                        message="Please try entering correct ID again!"
                        buttons={['OK']}
                    />

                    {!showAlert && loginSuccess?
                        <IonGrid>
                            <IonCard class = "card-style">
                                <IonCardHeader>
                                    <IonCardTitle>ENTER OTP: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={otp} type="password" /></IonCardTitle>
                                </IonCardHeader>
                            </IonCard>
                            <IonButton onClick = {createCase}>Create Case</IonButton>
                        </IonGrid>

                        :null}

                    <IonAlert
                        isOpen={showAlertCase}
                        onDidDismiss={() => setShowAlertCase(false)}
                        header="Alert"
                        subHeader="CASE CREATED SUCCESSFULLY"
                        message="Please wait for your appointment with doctor"
                        buttons={['OK']}
                    />

                    <IonAlert
                        isOpen={showAlertCaseErr}
                        onDidDismiss={() => setShowAlertCaseErr(false)}
                        header="Alert"
                        subHeader="!! CASE NOT CREATED..!"
                        message="There is some issue while creating CASE. Kindly contact developer..!"
                        buttons={['OK']}
                    />
                </IonGrid>
                {!showAlertCase && redirect ?
                    <Redirect to={{ pathname: '/supervisors', state: { userData: profileData?.userData } }} />
                    :null}

            </IonContent>

        </IonPage>
    )
};

export default NewCase;