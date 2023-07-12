
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

import { API_DOCINHOSP_DEL, API_DOCINHOSP_REG } from '../../api/Api';
import Cookie from 'universal-cookie';
import AlertLoggedOut from '../../components/AlertLoggedOut';

const DeleteDoctor: React.FC<any> = props=> {
    const cookie = new Cookie();
    const [showAlertNoSuchId, setShowAlertNoSuchId] = useState(false);
    const [alertHeader, setAlertHeader] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [auth, setAuth] = useState(true);

    const [id, setId] = useState(0);
    const [doctor, setDoctor] = useState<any>([]);
    const [openForm, setOpenForm] = useState(false);
    const docInHospId =useRef<HTMLIonInputElement>(null)
    const profile = props.location.state;
    const [profileData, setProfileData] = useState(profile);
    const path = "/supervisors/delete"



    const updateDoctor = async() => {
        let data = {

            'doctorId': {'doctorId': docInHospId.current!.value},

        }
        console.log(JSON.stringify(data))
        const addRecordEndpoint = `${API_DOCINHOSP_DEL}/${docInHospId.current!.value}`;

        const options = {
            method: 'DELETE',
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
                } else if(response['status'] === 401) {
                    setAuth(false)
                }else {
                    console.log("ERROR");
                    console.log(response)
                }
                return response.json();
            })
    }

    const handle = () => {
        if(openForm) setOpenForm(false);
        else setOpenForm(true);
    }

    useEffect(() => {
        fetch(`${API_DOCINHOSP_REG}/${id}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(async (response) => {
                if(response['status'] === 200) {
                    const data = await response.json();
                    setDoctor(data)
                    console.log(data)
                } else if(response['status'] === 401) setAuth(false)
                else if(id !== 0) setShowAlertNoSuchId(true);
            })
    },[openForm]);

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
                        <b>DELETE DOCTOR</b>
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
                        doctor.length != 0 ? (
                            <><IonCard class="card-style">
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonRow className = "header-border">
                                        <IonCol>
                                            <IonCardTitle>Doctor Id: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={docInHospId} class="card-input" placeholder="Id"></IonInput></IonCardTitle>
                                        </IonCol>


                                    </IonRow>
                                </IonGrid>
                            </IonCard>
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonButton onClick={updateDoctor}>Submit</IonButton>
                                </IonGrid>

                                <IonAlert
                                    isOpen={showAlert}
                                    onDidDismiss={() => setShowAlertNoSuchId(false)}
                                    subHeader="DATA UPDATED SUCCESSFULLY..!"
                                    buttons={['OK']}
                                /> 
                               </>
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

export default DeleteDoctor;