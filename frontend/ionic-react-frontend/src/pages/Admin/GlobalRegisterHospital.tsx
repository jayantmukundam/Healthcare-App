import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, IonCol, IonRow, IonCardHeader, IonCard, IonCardTitle, IonTabBar, IonTabButton, IonAlert
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

const path = "/admin/globalRegister"
const GlobalRegisterHospital: React.FC = () => {
    const cookie = new Cookie();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [auth, setAuth] = useState(true)

    const name = useRef<HTMLIonInputElement>(null)
    const address = useRef<HTMLIonInputElement>(null)

    const resetAll = () => {
        name.current!.value = null;
        address.current!.value = null;
    }


    const registerHospital = async() => {
        if(name.current!.value==null || address.current!.value==null){
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please fill required data..");
            return;
        }
        let data = {
            'name': name.current!.value,
            'address': address.current!.value
        }
        console.log(JSON.stringify(data))

        const addRecordEndpoint = `${API_HOSP_REG}/`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+cookie.get("jwt")
            },
            body: JSON.stringify(data)
        }

        await fetch(addRecordEndpoint, options)
            .then(function (response) {
                console.log(response);
                if (response['status'] === 201) {
                    console.log("DONE");
                } else if(response['status'] == 401) {
                    setAuth(false)
                    console.log("called")
                } else {
                    console.log("ERROR");
                }
                return response.json();
            }).then(function (data) {
                console.log(data);
                const items = data;
                if (data.size !== 0) {
                setShowAlert(true);
                setAlertHeader("Registration Successfull..")
                setAlertMessage("");
                resetAll();
                } else {
                    setShowAlert(true);
                    setAlertHeader("Registration unsuccessfull..")
                    setAlertMessage("");
                }

                return items;
            })
    }
    // useEffect(() => {console.log(auth)}, [auth])


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
                        <b>REGISTER HOPSITAL</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>


            <IonContent className='ion-padding'>
                <IonCard class = "card-style">
                    <IonGrid className='ion-text-center ion-margin' >
                        <IonRow className = "header-border">
                            <IonCol>
                                <IonCardTitle>Hospital Name:</IonCardTitle>
                                <IonCardTitle><IonInput ref={name} class="card-input"></IonInput></IonCardTitle>
                            </IonCol>
                        </IonRow>
                        <IonRow className = "header-border">
                            <IonCol>
                                <IonCardTitle>Hospital Address: </IonCardTitle>
                                <IonCardTitle><IonInput ref={address} class="card-input"></IonInput></IonCardTitle>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonCard>
                <IonGrid className='ion-text-center ion-margin'>
                    <IonButton onClick = {registerHospital}>Submit</IonButton>
                </IonGrid>
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
            </IonContent>
        </IonPage>
    )
}
export default GlobalRegisterHospital;
