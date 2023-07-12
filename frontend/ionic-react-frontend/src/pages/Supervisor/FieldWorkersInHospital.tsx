
import {
    IonContent,
    IonGrid,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage, IonSegment, IonRow, IonCol, IonItem, IonLabel, IonTextarea, IonDatetime
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
import '../../theme/variables.css';
import './Supervisor.css';
import {Redirect} from "react-router";
import React, {useEffect, useState} from "react";
import {type} from "os";
import BackButton from "../../components/BackButton";

import { API_FWINHOSP_REG } from '../../api/Api';
import Cookie from 'universal-cookie';
import AlertLoggedOut from '../../components/AlertLoggedOut';

import * as apis from '../../api/Api'

// setupIonicReact();

const FieldWorkersInHospital: React.FC<any> = props => {
    const cookie = new Cookie()
    const profile = props?.location?.state;
    const [profileData, setProfileData] = useState(profile);
    // console.log(props.location.state)
    const [fieldWorkers, setFieldWorkers] = useState<any[]>([]);
    const [currFieldWorker, setCurrFieldWorker] = useState(null);

    const [redirectToAssignTasks, setRedirectToAssignTasks] = useState(false);
    const [auth, setAuth] = useState(true)
    const path="/supervisors"


    const handlePickFieldWorker=(fieldWorker:any)=>{
        setCurrFieldWorker(fieldWorker);
        setRedirectToAssignTasks(true);
    }


    useEffect(() => {
        if(profile === undefined)
            setAuth(false);
        fetch(`${API_FWINHOSP_REG}/hospital/${profileData.userData.hospital.hospitalId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(function(response){
                if(response['status'] === 401) setAuth(false)
                return response.json();
            })
            .then((json) => {
                // setUseSt(true);
                setFieldWorkers(json);
                // console.log(json[0].fwInHospId);
                // setUseSt(1);
                // console.log(fieldWorkers[0]);
                return json;
            })
    }, []);


    return (
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

                 {/*<IonHeader>*/}
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>AVAILABLE FIELD WORKERS</b>
                    </IonTitle>
                </IonToolbar>
                {/*</IonHeader>*/}

            </IonHeader>

            <IonContent className='ion-padding'>
                <IonCard>
                    <IonGrid>

                        {fieldWorkers.map((fieldWorker,index) =>
                            <IonCard class="card-style">
                                <IonCardHeader>
                                    <IonSegment>
                                        <IonGrid>
                                            <IonRow>
                                                {/*<IonCol>*/}

                                                    <IonCol><h5>ID: {fieldWorker.fwInHospId}</h5></IonCol>
                                                    <IonCol><h5>Name: {fieldWorker.fieldWorker.fname}</h5></IonCol>
                                                    {/*<IonCol><h5>Name: {fieldWorker.fieldWorker.fname}</h5></IonCol> */}
                                                    <IonCol>
                                                        <IonButton onClick={()=>handlePickFieldWorker(fieldWorker)}>PICK</IonButton>

                                                        { redirectToAssignTasks ? <Redirect
                                                            to={{pathname: '/supervisors/fieldWorkersInHospital/assignTasks', state: {currFieldWorker,userData:profile.userData}}}/> : null}
                                                    </IonCol>


                                                {/*</IonCol>*/}
                                            </IonRow>
                                        </IonGrid>
                                    </IonSegment>
                                </IonCardHeader>
                            </IonCard>
                        )}
                        {
                            !auth ? 
                            <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                            :null
                        }

                    </IonGrid>



                </IonCard>
            </IonContent>
        </IonPage>
    )
};

export default FieldWorkersInHospital;
