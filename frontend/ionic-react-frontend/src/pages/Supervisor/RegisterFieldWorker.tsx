import {
    IonPage,
    IonGrid,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRow, IonCol, IonInput, IonDatetime, IonButton, IonAlert
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
import {useRef, useState} from "react";
import {Redirect} from "react-router";
import BackButton from "../../components/BackButton";
import { API_FWINHOSP_REG, API_FW_REG } from '../../api/Api';
import Cookie from 'universal-cookie'
import AlertLoggedOut from '../../components/AlertLoggedOut';

// setupIonicReact();

const RegisterFieldWorker: React.FC<any> = props => {
    const cookie = new Cookie();
   // const supId = props.location.state;
    const fwId= useRef<HTMLIonInputElement>(null);
    const hospId= useRef<HTMLIonInputElement>(null);

    const [showAlert, setShowAlert] = useState(false);
    const [showAlertErr, setShowAlertErr] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [auth, setAuth] = useState(true);
    const [displayFieldWorkerId, setDisplayFieldWorkerId] = useState(0);
    const [alertHeader,setAlertHeader] = useState<string>();
    const [alertMessage,setAlertMessage] = useState<string>();
    const profile = props.location.state;
    const [profileData, setProfileData] = useState(profile);
    const path = "/supervisors/register"




    const resetAll = () => {
        fwId.current!.value = null;
        hospId.current!.value=null;
    }

    const registerFieldWorker = async() => {

        fetch(`${API_FW_REG}/${fwId.current!.value}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(function(response){
                console.log(response);
                if(response['status'] === 200){
                    console.log("DONE");
                } else if(response['status'] === 401) setAuth(false)
                else{
                    console.log("ERROR");
                }
                return response.json();
            })
            .then(function(data){
                    console.log(data);
                    const items  = data;
                    console.log(items.success);
                    if(items.success === false) {
                        return -1;
                    }
                    // setShowAlertNoSuchId(false);
                    return items.fieldWorkerId;
                }
            )
            .then( async function (fieldWorkerId){
                    if(fieldWorkerId === -1){
                        setAlertHeader("No such ID");
                        setAlertMessage("Kindly enter a correct field worker ID");
                        setShowAlert(true);
                    }
                    else {

                        let data = {
                            'hospital': {'hospitalId': hospId.current!.value},
                            'doctor': {'doctorId': fwId.current!.value}

                        };
                        console.log(JSON.stringify(data));


                        const addRecordEndpoint = `${API_FWINHOSP_REG}/fwInHosp/${fwId.current!.value}/hospital/${hospId.current!.value}`;                        const options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ cookie.get("jwt")
                            },
                            body: JSON.stringify(data)
                        }
                        await fetch(addRecordEndpoint, options)
                            .then(function (response) {
                                console.log(response);
                                if (response['status'] === 201) {
                                    console.log("DONE");
                                } else if(response['status'] === 401) setAuth(false)
                                else {
                                    console.log("ERROR");
                                }
                                return response.json();
                            })
                            .then(function (data) {
                                console.log(data);
                                const items = data;
                                if (data.size !== 0) {
                                    // setDisplayPatientId(items.patientId);
                                    // console.log(displayPatientId);
                                    setShowAlert(true);
                                    setAlertHeader("Fieldworker registered successfully")
                                    setAlertMessage("")
                                    setRedirect(true);
                                    resetAll();
                                } else {
                                    setShowAlert(false);
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
                        <b>FIELDWORKER REGISTRATION</b>
                    </IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent className='ion-padding'/*class = "content-style"*/>
                <IonCard class = "card-style">
                    <IonGrid className='ion-text-center ion-margin' >


                        <IonRow className = "header-border">

                            <IonCol>
                                <IonCardTitle>FieldWorker Id: </IonCardTitle>
                                <IonCardTitle><IonInput ref={fwId} class="card-input" placeholder="Id"></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Hospital Id: </IonCardTitle>
                                <IonCardTitle><IonInput ref={hospId} class="card-input" placeholder="Id"></IonInput></IonCardTitle>
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
                    header={alertHeader}
                    message={alertMessage}
                    buttons={['OK']}
                />



                {!showAlert && redirect?<Redirect to={{ pathname: "/supervisors/register", state: { userData: profileData.userData } }}/>
                    :null}

            </IonContent>

        </IonPage>    )
};

export default RegisterFieldWorker;