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
import AdminBackButton from "../../components/AdminBackButton";
import { API_HOSP_REG } from '../../api/Api';
import Cookie from 'universal-cookie';
import AlertLoggedOut from '../../components/AlertLoggedOut';

const path = "/admin/globalUpdate"
const GlobalUpdateHospital = () => {
    const cookie = new Cookie();
    const [showAlertNoSuchId, setShowAlertNoSuchId] = useState(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [id, setId] = useState(0);
    const [hospital, setHospital] = useState<any>([]);
    const [openForm, setOpenForm] = useState(false);
    const [auth, setAuth] = useState(true);

    const name = useRef<HTMLIonInputElement>(null)
    const address = useRef<HTMLIonInputElement>(null)
    const registrationDate = useRef<HTMLIonInputElement>(null)

    const resetAll = () => {
        setHospital([])
    }

    const updateHospital = async() => {
        if(name.current!.value=="" || address.current!.value=="" || registrationDate.current!.value==""){
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please fill required data..");
            return;
        }
        let data = {
            'hospitalId': hospital.hospitalId,
            'name': name.current!.value,
            'address': address.current!.value,
            'registrationDate': registrationDate.current!.value
        }
        console.log(JSON.stringify(data))

        const addRecordEndpoint = `${API_HOSP_REG}/${hospital.hospitalId}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+cookie.get("jwt")
            },
            body: JSON.stringify(data)
        }
        await fetch(addRecordEndpoint, options)
        .then(function (response) {
            console.log(response);
            if (response['status'] === 200) {
                console.log("DONE");
                setShowAlert(true);
                setAlertHeader("Data Updated Successfully..")
                setAlertMessage("");
                resetAll();
            } else if(response['status'] === 401) {
                setAuth(false)
            }else {
                console.log("ERROR");
                setShowAlert(true);
                setAlertHeader("Data Updation unsuccessfull..")
                setAlertMessage("");
            }
            return response.json();
        })
    }



    const handle = () => {
        fetch(`${API_HOSP_REG}/${id}`, {headers : {Authorization: 'Bearer '+cookie.get("jwt")}})
           .then(async (response) => {
            if(response['status'] === 200) {
                const data = await response.json();
                setHospital(data)
                console.log(data)
            } else if(response['status'] === 401) {
                setAuth(false)
            }
            else if(id !== 0) setShowAlertNoSuchId(true);
           })
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
                    <b>ADMIN</b>
                    </IonTitle>
                </IonToolbar>

                <IonRow>
                    <AdminBackButton path={path}/>
                </IonRow>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>UPDATE HOSPITAL</b>
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
                        hospital.length != 0 ? (   
                        <><IonCard class="card-style">
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonRow className="header-border">
                                        <IonCol>
                                            <IonCardTitle>Hospital Name:</IonCardTitle>
                                            <IonCardTitle><IonInput ref={name} value={hospital.name} class="card-input"></IonInput></IonCardTitle>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow className="header-border">
                                        <IonCol>
                                            <IonCardTitle>Hospital Address: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={address} value={hospital.address} class="card-input"></IonInput></IonCardTitle>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow className="header-border">
                                        <IonCol>
                                            <IonCardTitle>Registration Date: </IonCardTitle>
                                            <IonCardTitle><IonInput ref={registrationDate} value={hospital.registrationDate} class="card-input"></IonInput></IonCardTitle>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCard><IonGrid className='ion-text-center ion-margin'>
                                    <IonButton onClick={updateHospital}>Submit</IonButton>
                                </IonGrid>
                             </>
                        ) : null
                    }
                {
                    !auth ? 
                    <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                    :null
                }
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={alertHeader}
                    message={alertMessage}
                    buttons={['OK']}
                />
                
                </IonGrid>
                
                </IonContent>
        </IonPage>
    )
}

export default GlobalUpdateHospital;