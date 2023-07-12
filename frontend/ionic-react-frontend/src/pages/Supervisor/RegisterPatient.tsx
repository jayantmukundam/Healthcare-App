
import {
    IonPage,
    IonCard,
    // IonCardHeader,
    IonCardTitle,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonDatetime,
    IonButton, IonAlert, IonGrid, IonCol, IonRow
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

// import Alert from "../../items/Alert";
// import { useNavigate } from 'react-router-dom';

/* Theme variables */
import '../../theme/variables.css';
import './Supervisor.css';
import {useEffect, useRef, useState} from "react";
import { Redirect } from 'react-router';
import BackButton from "../../components/BackButton";

import { API_PATIENT, API_SUP_REG } from '../../api/Api';
import Cookie from 'universal-cookie'
import AlertLoggedOut from '../../components/AlertLoggedOut';

import * as apis from '../../api/Api'

// setupIonicReact();

const RegisterPatient: React.FC<any> = props => {
    const cookie = new Cookie();
    const profile = props.location.state;
    const [profileData, setProfileData] = useState(profile);

    const [showAlert, setShowAlert] = useState(false);
    const [showAlertErr, setShowAlertErr] = useState(false);
    const [showAlertAll, setShowAlertAll] = useState(false);

    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>();

    const [redirect, setRedirect] = useState(false);
    const [auth, setAuth] = useState(true);

    const [displayPatientId, setDisplayPatientId] = useState(0);

    // const [hospitalId, setHospitalId] = useState(0);
    const [showAlertNoSuchId, setShowAlertNoSuchId] = useState(false);
    const path = "/supervisors/register"

    // const profileData = useRef<HTMLIonInputElement>(null);
    const fname = useRef<HTMLIonInputElement>(null);
    const lname = useRef<HTMLIonInputElement>(null);
    const gender = useRef<HTMLIonInputElement>(null);
    const dob = useRef<HTMLIonDatetimeElement>(null);
    const address = useRef<HTMLIonInputElement>(null);
    const phoneNo = useRef<HTMLIonInputElement>(null);
    const supervisorId = useRef<HTMLIonInputElement>(null);
    const resetAll = () => {
        // profileData.current!.value = null;
        dob.current!.reset();
        fname.current!.value = null;
        lname.current!.value = null;
        gender.current!.value = null;
        address.current!.value = null;
        phoneNo.current!.value = null;
    }

    // useEffect(() => {
    //     console.log(profileData);
    // })

    const registerPatient = async() => {
        let flag = true;
        let ph = phoneNo.current!.value;
        ph = ph!.toString();
        // console.log(ph.length);
        if(ph[0] !== '+' && ph[1] !== '9' && ph[2]!=='1'){
            flag = false;
        }
        for(let i = 1; i<ph.length; i++){
            if(ph[i]>'9' || ph[i]<'0'){
                console.log(ph[i]);
                flag = false;
            }
        }
        if(ph.length !== 13)
            flag = false;

        console.log(flag);

        if(!flag || fname.current!.value==null || lname.current!.value==null || gender.current!.value==null || dob.current!.value==null || phoneNo.current!.value==null || address.current!.value==null){
            setShowAlertAll(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please fill required data or check if phone number is valid..");
            return;
        }
        //here
        // console.log(`${API_SUP_REG}/${profileData.userData.supervisorId}`);
        fetch(`${API_SUP_REG}/${profileData.userData.supervisorId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(function(response){
                if(response['status'] === 200){
                    console.log("DONE");
                } else if(response['status'] === 401) setAuth(false)
                else{
                    console.log("ERROR");
                }
                return response.json();
            })
            .then(function(data){
                    const items  = data;
                    if(items.success === false) {
                        return -1;
                    }
                    setShowAlertNoSuchId(false);
                    return items.hospital.hospitalId;
                }
            )
            .then( async function (hospitalId){
                if(hospitalId === -1){
                    setShowAlertNoSuchId(true);
                }
                else {
                    setShowAlertNoSuchId(false);
                    var changeDateFormat = dob.current!.value;
                    if(changeDateFormat!=null && typeof(changeDateFormat)=='string')
                        changeDateFormat = changeDateFormat.split('T')[0];
                    let data = {
                        'hospital': {'hospitalId': hospitalId},
                        'supervisor': {'supervisorId': profileData.userData.supervisorId},
                        'fname': fname.current!.value,
                        'lname': lname.current!.value,
                        'gender': gender.current!.value,
                        'address': address.current!.value,
                        'phoneNo': phoneNo.current!.value,
                        'dob': changeDateFormat
                    };
                    console.log(JSON.stringify(data));
                    const addRecordEndpoint = `${API_PATIENT}/`;
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+ cookie.get("jwt")
                        },
                        body: JSON.stringify(data)
                    }

                        await fetch(addRecordEndpoint, options)
                            .then(function (response) {
                                if (response['status'] === 201) {
                                    console.log("DONE");
                                } else if(response['status'] === 401) setAuth(false)
                                else {
                                    console.log("ERROR");
                                }
                                return response.json();
                            })
                            .then(function (data) {
                                const items = data;
                                if (data.size !== 0) {
                                    setDisplayPatientId(items.patientId);
                                    setShowAlert(true);
                                    setShowAlertErr(false);
                                    setRedirect(true);
                                    resetAll();
                                } else {
                                    setShowAlert(false);
                                    setShowAlertErr(true);
                                    setRedirect(false);
                                }

                                return items;
                            })
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
                        <b>PATIENT REGISTRATION</b>
                    </IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent className='ion-padding'>
                <IonCard class = "card-style">
                    <IonGrid className='ion-text-center ion-margin'>
                        <IonAlert
                            isOpen={showAlertNoSuchId}
                            onDidDismiss={() => setShowAlertNoSuchId(false)}
                            header= "No such supervisor ID found please try again..!"
                            subHeader="ID NOT FOUND..!"
                            message="!!UNSUCCESSFUL..!"
                            buttons={['OK']}
                        />

                        <IonRow className = "header-border">

                            <IonCol>
                                <IonCardTitle>First Name: </IonCardTitle>
                                <IonCardTitle><IonInput ref={fname} class="card-input" placeholder="Binod"></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Last Name: </IonCardTitle>
                                <IonCardTitle><IonInput ref={lname} class="card-input" placeholder="Modi"></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Gender: </IonCardTitle>
                                <IonCardTitle><IonInput ref={gender} class="card-input" placeholder="M"></IonInput></IonCardTitle>
                            </IonCol>

                        </IonRow>

                        <IonRow className = "header-border">
                            <IonCol><IonCardTitle>Date of Birth: </IonCardTitle></IonCol>
                            <IonCol><IonCardTitle class="ion-card-subtitle-style"><IonDatetime ref={dob} display-format="MM/DD/YYYY" picker-format="MM DD YYYY"></IonDatetime></IonCardTitle></IonCol>
                        </IonRow>

                        <IonRow className = "header-border">
                            <IonCol>
                                <IonCardTitle>Address: </IonCardTitle>
                                <IonCardTitle><IonInput ref={address} class="card-input" placeholder="IIITB- Electronic City Phase 1"></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Phone Number: </IonCardTitle>
                                <IonCardTitle><IonInput ref={phoneNo} class="card-input" type="tel" placeholder="888-888-8888"></IonInput></IonCardTitle>

                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCard>

            <IonGrid className='ion-text-center ion-margin'>
            <IonButton onClick = {registerPatient}>Submit</IonButton>
            </IonGrid>
                {
                    !auth ? 
                    <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                    :null
                }
               <IonAlert
                   isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header= {`PATIENT ID: ${displayPatientId}`}
                    subHeader="Registration Successful..!"
                    message="Please go to Patient Login Tab to Login..!"
                    buttons={['OK']}
                />

                <IonAlert
                    isOpen={showAlertErr}
                    onDidDismiss={() => setShowAlertErr(false)}
                    header="Alert"
                    subHeader="Registration Unsuccessful..!"
                    message="Please Go to Patient Registration Tab and Register Again!"
                    buttons={['OK']}
                />

                <IonAlert
                    isOpen={showAlertAll}
                    onDidDismiss={() => setShowAlertAll(false)}
                    header={alertHeader}
                    message={alertMessage}
                    buttons={['OK']}
                />

                {!showAlert && redirect?<Redirect to= {{ pathname: "/supervisors/register", state: { userData: profileData.userData }}} />
                    :null}

            </IonContent>

        </IonPage>
    )
};

export default RegisterPatient;