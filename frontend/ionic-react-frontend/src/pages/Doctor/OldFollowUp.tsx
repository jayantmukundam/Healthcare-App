
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
import React, { useEffect, useState, useRef } from "react";

// import Date from "../items/Date";

/* Theme variables */
import '../../theme/variables.css';
import './Doctor.css';
import { Redirect } from "react-router";
import DoctorHome from "./DoctorHome";
import { Route } from "react-router-dom";
import BackButton from "../../components/BackButton";

import { API_ACTIVE_VIS, API_FOLLOWUPS, API_FOLLOWUP_VIS } from '../../api/Api';
import Cookie from 'universal-cookie';
import AlertLoggedOut from '../../components/AlertLoggedOut';

import * as apis from '../../api/Api'


// setupIonicReact();
const OldFollowUp: React.FC<any> = props => {
    const cookie = new Cookie();
    const f = props.location.state;
    const [followUpDetails, setFollowUpDetails] = useState(f.currFollowUp);
    useEffect(() => {
        console.log(f);
    }, [])
    const [profileData, setProfileData] = useState(f.userData);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [redirect, setRedirect] = useState(false);
    const [showFollowUpOption, setShowFollowUpOption] = useState(false);
    const [followUps, setFollowUps] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<boolean[]>([false]);
    const [currFollowUpExpanded, setCurrFollowUpExpanded] = useState(false);
    const [tasksAssigned, setTasksAssigned] = useState<string>();
    const [save, setSave] = useState(false);
    const [auth, setAuth] = useState(true);
    const followUpDate = useRef<HTMLIonDatetimeElement>(null);
    const currTaskList = followUpDetails.taskAssignedByDoctor.split("$")
    const currReviewList = followUpDetails.reviewByFieldWorker.split("$")
    const [oldTaskList, setOldTaskList] = useState<string[]>([])
    const [oldReviewList, setOldReviewList] = useState<string[]>([])

    const path = "/doctorInHospital"
    const handleExpandFollowUp = (index: any) => {
        const tasks = followUps[index].taskAssignedByDoctor.split("$")
        const reviews = followUps[index].reviewByFieldWorker.split("$")
        setOldTaskList(tasks)
        setOldReviewList(reviews)
        let newArray = [...expanded];
        if (newArray[index] === true)
            newArray[index] = false;

        else
            newArray[index] = true;
        setExpanded(newArray);
    }

    const handleCurrentFollowupExpand = () => {
        if (currFollowUpExpanded === true)
            setCurrFollowUpExpanded(false);
        else
            setCurrFollowUpExpanded(true);
    }

    const handleYes = () => {
        setShowFollowUpOption(true);
    }


    const handleSubmitFollowUps = async () => {
        if (tasksAssigned == null || followUpDate.current!.value == null) {
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please assign some task and follow-up date");
            return;
        }
        let temp;
        if (tasksAssigned != null)
            temp = tasksAssigned.replace(/\n/g, "$");


        var changeDateFormat = followUpDate.current!.value;
        if (changeDateFormat != null && typeof (changeDateFormat) == 'string')
            changeDateFormat = changeDateFormat.split('T')[0];
        const verificationNo = Math.floor(100000 + Math.random() * 900000);
        const phoneNo = followUpDetails?.visit?.patient?.phoneNo
        // setTasksAssigned(temp);
        let newFollowUp = {
            'followUpDate': changeDateFormat,
            'taskAssignedByDoctor': temp,
            'visit': { 'visitId': followUpDetails.visit.visitId },
            'isActive': 1,
            'fieldWorkerInHospital': { 'fwInHospId': followUpDetails.fieldWorkerInHospital.fwInHospId },
            'reviewByFieldWorker': "",
            'verificationNumber': verificationNo
        };
        const addRecordEndpoint = `${apis.API_FOLLOWUPS}/`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookie.get("jwt")
            },
            body: JSON.stringify(newFollowUp)
        }

        await fetch(addRecordEndpoint, options)
            .then(function (response) {
                if (response['status'] === 201) {
                    console.log("DONE");
                }
                else {
                    console.log("ERROR");
                }
                return response.json();
            }).then(() => {
                fetch(`${apis.API_FOLLOWUP_DOC_END}/${followUpDetails.followUpId}`, { method: 'PUT', headers: { Authorization: 'Bearer ' + cookie.get("jwt") } })
                    .then((response) => {
                        if (response.status === 401)
                            setAuth(false);
                    })
            }).then(() => {
                fetch(`${apis.API_SEND_SMS}/${phoneNo}/verificationNo/${verificationNo}`, { headers: { Authorization: 'Bearer ' + cookie.get("jwt") } })
                    .then(function (response) {
                        setRedirect(true);
                    })
            })

    }

    const handleEndFollowUp = () => {
        fetch(`${apis.API_FOLLOWUP_DOC_END}/${followUpDetails.followUpId}`, { method: 'PUT', headers: { Authorization: 'Bearer ' + cookie.get("jwt") } })
            .then((response) => {
                if (response.status === 401)
                    setAuth(false);
            }).then(()=>{
                setRedirect(true);
            })
    }

    useEffect(() => {
        fetch(`${API_FOLLOWUP_VIS}/${followUpDetails.visit.visitId}/followUpId/${followUpDetails.followUpId}`, { headers: { Authorization: 'Bearer ' + cookie.get("jwt") } })
            .then(function (response) {
                if (response['status'] === 401) setAuth(false)
                return response.json();
            })
            .then((json) => {
                setFollowUps(json);

                return json;
            })
    }, []);

    //dynamic task by doctor:

    let count = 1;

    const [mapTask, setMapTask] = useState(['']);

    const addNew = (key: number) => {
        let pseudo = mapTask;
        pseudo = [...pseudo, ''];
        setMapTask(pseudo);
    }

    const [changeState, setChangeState] = useState(false);

    const deleteIt = (index: number) => {
        let pseudo = mapTask;
        if (pseudo.length > 1) {
            pseudo.splice(index, 1);
            setMapTask(pseudo);
            if (changeState)
                setChangeState(false);
            else
                setChangeState(true);
        }
    }

    useEffect(() => {
    }, [changeState]);

    const handleChangeOfTask = (event: any, index: number) => {
        mapTask[index] = event!.target!.value;
        setMapTask(mapTask);
        let assignedTask = "";

        mapTask.map((data) => {
            assignedTask += data;
            assignedTask += '$';
        })
        assignedTask += 'Remarks'
        // assignedTask = assignedTask.substring(0, assignedTask.length - 1);

        setTasksAssigned(assignedTask);
    }

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
                        <b>DOCTOR</b>
                    </IonTitle>
                </IonToolbar>

                <IonRow>
                    <BackButton path={path} data={profileData}></BackButton>
                </IonRow>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>FOLLOW-UP DETAILS</b>
                    </IonTitle>
                </IonToolbar>

            </IonHeader>



            <IonContent className='ion-padding'>
                <IonGrid>
                    <IonCard class="card-style">
                        <IonCardHeader>
                            <IonSegment>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonButton onClick={handleCurrentFollowupExpand}>Latest Follow-up Details</IonButton>
                                            {
                                                currFollowUpExpanded &&
                                                <IonCol>
                                                    <h5>Follow-up Date: {followUpDetails.followUpDate}</h5>
                                                    <h5>Tasks Assigned:</h5>
                                                    <IonRow>
                                                        <IonCol>
                                                            <h5>Tasks Assigned:</h5>
                                                            {currTaskList.map((task: any) =>
                                                                <IonRow>
                                                                    <IonCol>
                                                                        <h6 className="item-border">{task}</h6>
                                                                    </IonCol>
                                                                </IonRow>
                                                            )}
                                                        </IonCol>
                                                        <IonCol>
                                                            <h5>Reviews:</h5>
                                                            {currReviewList.map((review: any) =>
                                                                <IonRow>
                                                                    <IonCol>
                                                                        <h6 className="item-border">{review}</h6>
                                                                    </IonCol>
                                                                </IonRow>
                                                            )}
                                                        </IonCol>
                                                    </IonRow>
                                                </IonCol>
                                            }
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonSegment>
                        </IonCardHeader>
                    </IonCard>
                </IonGrid>



                <IonCard>
                    <IonGrid>
                        <IonRow class="ion-text-center">
                            <IonCol>
                                <h3>Old follow ups</h3>
                            </IonCol>
                        </IonRow>

                        {followUps.map((followUp, index) =>
                            <IonCard class="card-style">
                                <IonCardHeader>
                                    <IonSegment>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol>
                                                    <IonButton onClick={() => handleExpandFollowUp(index)}>Follow-up {index + 1} details</IonButton>
                                                    {expanded[index] &&
                                                        <IonCol>
                                                            <h5>Follow-up Date: {followUp.followUpDate}</h5>
                                                            <IonRow>
                                                                <IonCol>
                                                                    <h5>Tasks Assigned:</h5>
                                                                    {oldTaskList.map((task: any) =>
                                                                        <IonRow>
                                                                            <IonCol>
                                                                                <h6 className="item-border">{task}</h6>
                                                                            </IonCol>
                                                                        </IonRow>
                                                                    )}
                                                                </IonCol>
                                                                <IonCol>
                                                                    <h5>Reviews:</h5>
                                                                    {oldReviewList.map((review: any) =>
                                                                        <IonRow>
                                                                            <IonCol>
                                                                                <h6 className="item-border">{review}</h6>
                                                                            </IonCol>
                                                                        </IonRow>
                                                                    )}
                                                                </IonCol>
                                                            </IonRow>
                                                        </IonCol>
                                                    }


                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonSegment>
                                </IonCardHeader>
                            </IonCard>
                        )}

                        {
                            !showFollowUpOption &&

                            <IonCol class="ion-text-center">
                                <IonRow>
                                    <IonCol>
                                        <h3>Do you want to add followups for this patient?</h3>
                                    </IonCol>
                                </IonRow>


                                <IonRow>
                                    <IonCol>
                                        <IonButton onClick={handleYes}>Yes</IonButton>
                                        <IonButton onClick={handleEndFollowUp}>End Case</IonButton>
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

                                                {/* <IonTextarea value={tasksAssigned} onIonChange={(e) => setTasksAssigned(e.detail.value!)}></IonTextarea> */}
                                                {mapTask.map((value: any, index: any) => (
                                                    <IonTextarea key={index} value={mapTask[index]} onIonChange={(e) => handleChangeOfTask(e, index)}><IonButton size="small" onClick={() => { addNew(index) }}>Add</IonButton><IonButton size="small" onClick={() => deleteIt(index)}>Remove</IonButton></IonTextarea>
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

                                <IonRow class="ion-text-center">
                                    <IonCol>
                                        <IonButton onClick={handleSubmitFollowUps}>SUBMIT</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                        }
                        {
                            !auth ?
                                <AlertLoggedOut auth={auth} setAuth={setAuth}></AlertLoggedOut>
                                : null
                        }
                        <IonAlert
                            isOpen={showAlert}
                            onDidDismiss={() => setShowAlert(false)}
                            header={alertHeader}
                            message={alertMessage}
                            buttons={['OK']}
                        />

                        {!showAlert && redirect ? <Redirect to={{ pathname: '/doctorInHospital', state: { userData: profileData } }} />
                            : null}

                    </IonGrid>



                </IonCard>
            </IonContent>

        </IonPage>


    )
};

export default OldFollowUp;