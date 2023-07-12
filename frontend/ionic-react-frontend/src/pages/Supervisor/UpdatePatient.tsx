import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, IonCol, IonRow, IonCardHeader, IonCard, IonCardTitle, IonTabBar, IonTabButton, IonAlert, IonDatetime
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
import React, { useEffect, useRef, useState } from 'react';
import BackButton from "../../components/BackButton";

import { API_PATIENT } from '../../api/Api';
import Cookie from 'universal-cookie'
import AlertLoggedOut from '../../components/AlertLoggedOut';

const UpdatePatient:React.FC<any> = props => {
    const cookie = new Cookie();
    const [showAlertNoSuchId, setShowAlertNoSuchId] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [id, setId] = useState(0);
    const [patient, setPatient] = useState<any>([]);
    const [openForm, setOpenForm] = useState(false);
    const [auth, setAuth] = useState(true);
    const supId =useRef<HTMLIonInputElement>(null)
    const hospId= useRef<HTMLIonInputElement>(null)
    const fname = useRef<HTMLIonInputElement>(null);
    const lname = useRef<HTMLIonInputElement>(null);
    const gender = useRef<HTMLIonInputElement>(null);
    const dob = useRef<HTMLIonInputElement>(null)
    const address = useRef<HTMLIonInputElement>(null);
    const phoneNo = useRef<HTMLIonInputElement>(null);
    const patient_id=useRef<HTMLIonInputElement>(null);
    const profile = props.location.state;
    const [profileData, setProfileData] = useState(profile);
    const path="/supervisors"

    const resetAll = () => {
        // supervisorId.current!.value = null;
        dob.current!.value=null;
        patient_id.current!.value=null;
        fname.current!.value = null;
        lname.current!.value = null;
        gender.current!.value = null;
        address.current!.value = null;
        phoneNo.current!.value = null;
    }

    const updatePatient = async() => {
        let data = {
            'fname': fname.current!.value,
            'lname': lname.current!.value,
            'gender': gender.current!.value,
            'address': address.current!.value,
            'phoneNo': phoneNo.current!.value,
            'dob': dob.current!.value
        }
        console.log(JSON.stringify(data))
        const addRecordEndpoint = `${API_PATIENT}/${patient.patientId}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ cookie.get("jwt")
            },
            body: JSON.stringify(data)
        }
        await fetch(addRecordEndpoint, options)
            .then(function (response) {
                console.log(response);
                if (response['status'] === 200) {
                    console.log("DONE");
                    setShowAlert(true)
                } else if(response['status'] === 401) setAuth(false)
                else {
                    console.log("ERROR");
                    console.log(response)
                }
                return response.json();
            })
    }

    const handle = () => {
        fetch(`${API_PATIENT}/${id}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(async (response) => {
                if(response['status'] === 200) {
                    const data = await response.json();
                    setPatient(data)
                    console.log(data)
                    resetAll();
                } else if(response['status'] === 401) setAuth(false)
                else if(id !== 0) setShowAlertNoSuchId(true);
            })
        // if(openForm) setOpenForm(false);
        // else setOpenForm(true);
    }

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>HEALTH CARE SERVICES</b>
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
                        <b>UPDATE PATIENT</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'/*class = "content-style"*/>

                <IonGrid className='ion-text-center ion-margin'>
                    <IonSegment>
                        <form className="ion-padding">
                            <IonItem>
                                <IonLabel position="floating">ID</IonLabel>
                                <IonInput onIonInput={(e: any) => setId(e.target.value)}/>
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={handle}>
                                Search
                            </IonButton>


                            <IonAlert
                                isOpen={showAlertNoSuchId}
                                onDidDismiss={() => setShowAlertNoSuchId(false)}
                                subHeader="ID NOT FOUND..!"
                                message="!!UNSUCCESSFUL..!"
                                buttons={['OK']}
                            />
                        </form>
                    </IonSegment>
                    {
                        patient.length != 0 ? (
                            <><IonCard class="card-style">
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonRow className = "header-border">

                                        <IonCol>
                                            <IonCardTitle>First Name: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={fname} class="card-input" value={patient.fname}></IonInput></IonCardTitle>
                                        </IonCol>
                                        <IonCol>
                                            <IonCardTitle>Last Name: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={lname} class="card-input" value={patient.lname}></IonInput></IonCardTitle>
                                        </IonCol>
                                        <IonCol>
                                            <IonCardTitle>Gender: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={gender} class="card-input" value={patient.gender}></IonInput></IonCardTitle>
                                        </IonCol>
                                        <IonCol>
                                            <IonCardTitle>Date of Birth: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={dob} value={patient.dob} class="card-input"></IonInput></IonCardTitle>
                                        </IonCol>

                                    </IonRow>

                                    <IonRow className = "header-border">
                                        <IonCol>
                                            <IonCardTitle>Address: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={address} class="card-input" value={patient.address}></IonInput></IonCardTitle>
                                        </IonCol>
                                        <IonCol>
                                            <IonCardTitle>Phone Number: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={phoneNo} class="card-input" type="tel" value={patient.phoneNo}></IonInput></IonCardTitle>

                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCard>
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonButton onClick={updatePatient}>Submit</IonButton>
                                </IonGrid>

                                <IonAlert
                                    isOpen={showAlert}
                                    onDidDismiss={() => setShowAlertNoSuchId(false)}
                                    subHeader="DATA UPDATED SUCCESSFULLY..!"
                                    buttons={['OK']}
                                /> </>
                        ) : null
                    }
                    {
                        !auth ? 
                        <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                        :null
                    }
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default UpdatePatient;