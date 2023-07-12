
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
    IonRow,
    IonCol,
    IonCardContent,
    IonInput,
    IonLabel,
    IonItem,
    IonTextarea,
    IonButton,
    IonAlert, IonDatetime, IonSegment
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
import React, {useEffect, useState, useRef} from "react";

// import Date from "../items/Date";

/* Theme variables */
import '../../theme/variables.css';
import './Doctor.css';
import {Redirect} from "react-router";
import DoctorHome from "./DoctorHome";
import {Route} from "react-router-dom";
import BackButton from "../../components/BackButton";

import { API_FOLLOWUPS, API_VISITED } from '../../api/Api';
import Cookie from 'universal-cookie';
import AlertLoggedOut from '../../components/AlertLoggedOut';

import * as apis from '../../api/Api'

// setupIonicReact();
const Patient: React.FC<any> = props => {
    const cookie = new Cookie();
    const v = props.location.state;
    const [visitDetails, setVisitDetails] = useState(v.currCase);
    const [profileData, setProfileData] = useState(v.userData);
    const [showAlert, setShowAlert] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [auth, setAuth] = useState(true);
    const [showFollowUpOption, setShowFollowUpOption] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [prescription, setPrescription] = useState<string>();
    const [symptoms, setSymptoms] = useState<string>();
    const [tasksAssigned, setTasksAssigned] = useState<string>();
    const followUpDate = useRef<HTMLIonDatetimeElement>(null);
    const path = "/doctorInHospital"
    const [viewHistoryClicked,setViewHistoryClicked] = useState(false);
    const [askForFollowUp, setAskForFollowUp] = useState(false)


    const handleViewHistoryButton = ()=>{
        setViewHistoryClicked(true);
    }

    const submitDetails = async()=>{

        if(symptoms==null || prescription==null){
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please fill the symptoms and prescription");
            return;
        }


        visitDetails.symptoms = symptoms;
        visitDetails.prescription = prescription;
        visitDetails.doctorInHospital= {'docInHospId':profileData.docInHospId};
        visitDetails.isActive = 0;
        const addRecordEndpoint = `${apis.API_VISITED}/${visitDetails.visitId}`;

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ cookie.get("jwt")
            },
            body: JSON.stringify(visitDetails)
        }

        await fetch(addRecordEndpoint, options)
            .then(function (response) {
                if (response['status'] === 200) {
                    console.log("DONE");
                } else if(response['status'] === 401) setAuth(false)
                else {
                    console.log("ERROR");
                }
                return response.json();
            })
            .then(function (data) {
                const items = data;
                if (data.size != 0) {

                    setShowAlert(true);
                    setAlertHeader("Details submitted successfully")
                    setAlertMessage("Add followups if required")
                    setAskForFollowUp(true)
                    // setShowFollowUpOption(true)

                    // setRedirect(true);
                    // resetAll();
                } else {
                    setShowAlert(true);
                    setAlertHeader("Alert");
                    setAlertMessage("Unsuccessful");
                }
                return items;
            })
    }

    const handleSubmitFollowUps = async()=>{
        if(tasksAssigned==null || followUpDate.current!.value==null){
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please assign some task and follow-up date");
            return;
        }
        // var charCount = tasksAssigned.length + tasksAssigned.match(/\n/gm).length;
        let temp;
        if(tasksAssigned!=null)
            temp = tasksAssigned.replace(/\n/g, "$");
        var changeDateFormat = followUpDate.current!.value;
        if(changeDateFormat!=null && typeof(changeDateFormat)=='string')
            changeDateFormat = changeDateFormat.split('T')[0];

        let newFollowUp = {
            'followUpDate':changeDateFormat,
            'taskAssignedByDoctor':temp,
            'visit':{'visitId':visitDetails.visitId},
            'isActive':1,
            'fieldWorkerInHospital':{'fwInHospId':-1},
            'reviewByFieldWorker':""
        };
        const addRecordEndpoint = `${apis.API_FOLLOWUPS}/`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ cookie.get("jwt")
            },
            body: JSON.stringify(newFollowUp)
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

                setRedirect(true);

                return items;
            })


    }


    const handleYes = ()=>{
        setAskForFollowUp(false)
        setShowFollowUpOption(true);
    }

    const handleNo = ()=>{
        setRedirect(true)
    }

    //dynamic task by doctor:

    let count = 1;

    const [mapTask, setMapTask] = useState(['']);

    const addNew = (key:number) => {
        let pseudo = mapTask;
        pseudo = [...pseudo, ''];
        setMapTask(pseudo);
    }

    const [changeState, setChangeState] = useState(false);

    const deleteIt = (index:number) => {
        let pseudo = mapTask;
        if(pseudo.length > 1){
            pseudo.splice(index,1);
            setMapTask(pseudo);
            if(changeState)
                setChangeState(false);
            else
            setChangeState(true);
        }
    }

    useEffect(() => {
    },[changeState]);

    const handleChangeOfTask = (event:any, index:number) => {
        mapTask[index] = event!.target!.value;
        setMapTask(mapTask);
        let assignedTask = "";

        mapTask.map((data) => {
            assignedTask += data;
            assignedTask += '$';
        })
        assignedTask += 'Remarks'
        // assignedTask = assignedTask.substring(0,assignedTask.length-1);

        setTasksAssigned(assignedTask);
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
                        <b>DOCTOR</b>
                    </IonTitle>
                </IonToolbar>

                <IonRow>
                    <IonCol>
                        <BackButton path={path} data={profileData}></BackButton>
                    </IonCol>

            <IonCol>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>PATIENT DETAILS AND PRESCRIPTION</b>
                    </IonTitle>
                </IonToolbar>
            </IonCol>

                <IonCol className='ion-text-right'>
                    <IonButton onClick={handleViewHistoryButton}>View History</IonButton>
                </IonCol>
                </IonRow>


            </IonHeader>




            <IonContent className='ion-padding'>
                <IonCard class = "card-style">
                    <IonGrid className='ion-text-center ion-margin'>
                        <IonRow>
                            <IonCol>
                                <h2>Name : {visitDetails.patient.fname} {visitDetails.patient.lname}</h2>
                                <h2>Gender : {visitDetails.patient.gender}</h2>
<!--                                 <h2>Age : {visitDetails.patient.age}</h2> -->
                            </IonCol>

                        </IonRow>

                        {/*<IonRow>*/}

                        {/*</IonRow>*/}

                        <IonRow>
                            <IonCol>
                                <IonCard>
                                    <IonItem>
                                        <IonLabel position="floating">SYMPTOMS</IonLabel>
                                        
                                            <IonTextarea value={symptoms} onIonChange={(e) => setSymptoms(e.detail.value!)}></IonTextarea>
                                    </IonItem>
                                </IonCard>
                            </IonCol>

                            <IonCol>
                                <IonCard>
                                    <IonItem>
                                        <IonLabel position="floating">PRESCRIPTION</IonLabel>
                                        <IonTextarea value={prescription} onIonChange={(e) => setPrescription(e.detail.value!)}></IonTextarea>
                                    </IonItem>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                        {
                            !showFollowUpOption &&
                            <IonRow>
                                <IonCol>
                                    <IonButton onClick={submitDetails}>SUBMIT</IonButton>
                                </IonCol>
                            </IonRow>
                        }
                        {
                            askForFollowUp &&

                            <IonCol class="ion-text-center">
                                <IonRow>
                                    <IonCol>
                                        <h3>Do you want to add followups for this patient?</h3>
                                    </IonCol>
                                </IonRow>


                                <IonRow>
                                    <IonCol>
                                        <IonButton onClick={handleYes}>Yes</IonButton>
                                        <IonButton onClick={handleNo}>No</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                        }



                        {showFollowUpOption &&
                            <IonCol>
                                <IonRow>
                                    <IonCol>
                                        <IonCard>
                                            <IonItem>
                                                <IonLabel class="ion-text-center" position="floating">ADD FOLLOW UP INSTRUCTIONS FOR THE FIELD WORKER</IonLabel>
                                                {mapTask.map((value: any, index: any) => (
                                                    <IonTextarea key = {index} value={mapTask[index]} onIonChange={(e) => handleChangeOfTask(e, index)}><IonButton size = "small" onClick={()=> {addNew(index)}}>Add</IonButton><IonButton size = "small" onClick={() => deleteIt(index)}>Remove</IonButton></IonTextarea>
                                                // <IonTextarea value={tasksAssigned} onIonChange={(e) => setTasksAssigned(e.detail.value!)}></IonTextarea>
                                                 ))}
                                            </IonItem>
                                        </IonCard>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonCardTitle>Follow-up Date: </IonCardTitle>
                                    </IonCol>
                                    {/*</IonRow>*/}
                                    {/*<IonRow>*/}
                                    <IonCol>
                                        <IonCardTitle class="ion-card-subtitle-style">
                                            <IonDatetime ref={followUpDate} display-format="MM/DD/YYYY" picker-format="MM DD YYYY"></IonDatetime>
                                        </IonCardTitle>
                                    </IonCol>
                                </IonRow>

                                <IonRow>
                                    <IonCol>
                                        <IonButton onClick={handleSubmitFollowUps}>SUBMIT</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                        }

                    </IonGrid>
                </IonCard>
            </IonContent>
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

            {viewHistoryClicked && <Redirect to={{pathname:'/doctorInHospital/patient/viewHistory',state: {visitDetails,userData: profileData }}}/>}

            {!showAlert && redirect?<Redirect to={{pathname:'/doctorInHospital',state: { userData: profileData }}}/>
                :null}
        </IonPage>
    )
};

export default Patient;
