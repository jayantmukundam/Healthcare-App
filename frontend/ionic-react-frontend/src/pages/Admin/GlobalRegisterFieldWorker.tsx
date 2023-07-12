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
import React, { useRef, useState } from 'react';
import BackButton from "../../components/BackButton";
import AdminBackButton from "../../components/AdminBackButton";
import { API_FW_REG } from '../../api/Api';
import Cookie from 'universal-cookie'
import AlertLoggedOut from '../../components/AlertLoggedOut';

const path="/admin/globalRegister"
const GlobalRegisterFieldWorker: React.FC = () => {
    const cookie = new Cookie();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [auth, setAuth] = useState(true);
    
    const fname = useRef<HTMLIonInputElement>(null)
    const lname = useRef<HTMLIonInputElement>(null)
    const gender = useRef<HTMLIonInputElement>(null)
    const dob = useRef<HTMLIonDatetimeElement>(null)
    const phoneNo = useRef<HTMLIonInputElement>(null)
    const address = useRef<HTMLIonInputElement>(null)

    const resetAll = () => {
        fname.current!.value = null;
        lname.current!.value = null;
        gender.current!.value = null;
        dob.current!.reset();
        phoneNo.current!.value = null;
        address.current!.value = null;
    }

    const registerFieldWorker = async () => {
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
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please fill required data..");
            return;
        }
        let data = {
            'fname': fname.current!.value,
            'lname': lname.current!.value,
            'gender': gender.current!.value,
            'dob': dob.current!.value,
            'phoneNo': phoneNo.current!.value,
            'address': address.current!.value
        }
        console.log(JSON.stringify(data))
        const addRecordEndpoint = `${API_FW_REG}/`;
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
                } else if(response['status'] === 401) {
                    setAuth(false)
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
                        <b>REGISTER FIELDWORKER</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'/*class = "content-style"*/>
                <IonCard class = "card-style">
                    <IonGrid className='ion-text-center ion-margin' >
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
                        <IonButton onClick = {registerFieldWorker}>Submit</IonButton>
                        </IonGrid>
                        {
                            !auth ? 
                            <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                            :null
                        }

                        <IonAlert
                            isOpen={showAlert}
                            onDidDismiss={() => setShowAlert(false)}
                            header= {alertHeader}
                            message={alertMessage}
                            buttons={['OK']}
                        />
                </IonContent>          
        </IonPage>
    )
}
export default GlobalRegisterFieldWorker;
