
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
    IonButton, IonSegment, IonRow, IonCol, IonCheckbox, IonLabel, IonAlert
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
import {Redirect} from "react-router";
import React, {useEffect, useState} from "react";
import BackButton from "../../components/BackButton";

import Cookie from 'universal-cookie';
import AlertLoggedOut from '../../components/AlertLoggedOut';

import {API_FOLLOWUPS, API_FWINHOSP_REG, API_SEND_SMS} from "../../api/Api";

// setupIonicReact();

const AssignTasks: React.FC<any> = props => {

    const cookie = new Cookie()
    const [followUps, setFollowUps] = useState<any[]>([]);
    const [picked, setPicked] = useState<boolean[]>([false]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertHeader,setAlertHeader] = useState<string>();
    const [alertMessage,setAlertMessage] = useState<string>();
    const [redirect, setRedirect] = useState<boolean>(false);
    const [auth, setAuth] = useState(true)

    const f = props?.location?.state;
    // console.log(f)
    const [profileData, setProfileData] = useState(f?.userData);
    const [fieldWorkerDetails,setFieldWorkerDetails] = useState(f?.currFieldWorker)
    // console.log(profileData)
    const [tasksAssigned, setTasksAssigned] = useState(fieldWorkerDetails.numOfTasksAssignedPerDay)
    const path = "/supervisors/fieldWorkersInHospital"
    // console.log(fieldWorkerDetails.currFieldWorker);
    // let count=0;
    const handleSelectFollowUp=(index:any)=>{
        // console.log(index);
        if(picked[index]===true){
            setTasksAssigned(tasksAssigned-1)
            picked[index]=false;
            // count--;
        }

        else{
            setTasksAssigned(tasksAssigned+1)
            picked[index]=true;
            // count++;
        }

    }

    const handleSubmit=async ()=>{
        if(tasksAssigned>5){
            console.log("NOT ALLOWED")
            setAlertHeader("Too many tasks.");
            setAlertMessage("Do not assign more than 5 tasks to a field worker");
            setShowAlert(true);
            return;
        }
        var i=0;
        for(;i<followUps.length;i++){
            if(picked[i]===true){
                const followUpId = followUps[i].followUpId;
                const verificationNo = Math.floor(100000 + Math.random() * 900000);
                const phoneNo = followUps[i]?.visit?.patient?.phoneNo
                followUps[i].verificationNumber = verificationNo
                followUps[i].fieldWorkerInHospital = {"fwInHospId":fieldWorkerDetails.fwInHospId}
                console.log(followUps[i])
                const addRecordEndpoint = `${API_FOLLOWUPS}/${followUpId}`;

                const options = {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ cookie.get("jwt")
                    },

                    body: JSON.stringify(followUps[i])
                }
                fetch(addRecordEndpoint,options)
                    .then(function (response) {
                        console.log(response);
                        if (response['status'] === 200) {
                            console.log("DONE");
                        } else if(response['status'] === 401) {
                            setAuth(false)
                        }else {
                            console.log("ERROR");
                        }
                        return response.json();
                    }).then(function(){
                    console.log(phoneNo)
                    fetch(`${API_SEND_SMS}/${phoneNo}/verificationNo/${verificationNo}`, {headers : {Authorization: 'Bearer '+cookie.get("jwt")}})
                        .then(function (response){
                            console.log(response)
                        })
                })

            }
        }
        // .then(async function () {
            console.log(tasksAssigned);
            // console.log(fieldWorkerDetails.currFieldWorker.numOfTasksAssignedPerDay);
            fieldWorkerDetails.numOfTasksAssignedPerDay=tasksAssigned;
        const addRecordEndpoint = `${API_FWINHOSP_REG}/${fieldWorkerDetails.fwInHospId}`;

            const options = {
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ cookie.get("jwt")
                },
                body: JSON.stringify(fieldWorkerDetails)
            }
            //
            const response = await fetch(addRecordEndpoint, options);
            const result = await response;
            console.log(response);
            if(result['status'] === 200){
                console.log("DONE");
                setShowAlert(true);
                setAlertHeader("Success.")
                setAlertMessage("Tasks assigned successfully.")
                // setShowAlertCaseErr(false);
                setRedirect(true);
            }else if(response['status'] === 401) {
                setAuth(false)
            }
            else{
                console.log("ERROR");
                setShowAlert(true);
                setAlertHeader("Error while assigning");
                setRedirect(false);
            }
        // })


    }

    useEffect(() => {
        if(f === undefined){
            setAuth(false);
        }
        fetch(`${API_FOLLOWUPS}/remaining/${profileData?.hospital?.hospitalId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then(function(response) {
                if(response['status'] === 401) {
                    setAuth(false)
                }
                return response.json()
            })
            .then((json) => {
                // setUseSt(true);
                console.log(json)
                setFollowUps(json);
                // console.log(json[0].fwInHospId);
                // setUseSt(1);
                // console.log(fieldWorkers[0]);
                return json;
            })
    }, []);

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
                    <BackButton path={path} data={profileData}></BackButton>
                </IonRow>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>ASSIGN TASK</b>
                    </IonTitle>
                </IonToolbar>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>SELECT FOLLOWUPS FROM THE BELOW LIST</b>
                    </IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent className='ion-padding'/*class = "content-style"*/>
                <IonGrid>
                    <IonCard class="card-style">
                        <IonRow>
                            <IonCol>
                                <h5>Name : {fieldWorkerDetails.fieldWorker.fname}</h5>
                                <h5>Gender : {fieldWorkerDetails.fieldWorker.gender}</h5>
                                <h5>Address : {fieldWorkerDetails.fieldWorker.address}</h5>
                                <h5>Tasks assigned : {tasksAssigned}</h5>
                            </IonCol>
                        </IonRow>
                    </IonCard>
                </IonGrid>
                <IonGrid className='ion-text-center ion-margin'>
                    {followUps!=null && followUps.map((followUp,index) =>
                        <IonCard class="card-style">
                            <IonCardHeader>
                                <IonSegment value={followUp.followUpId} key={followUp.followUpId}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCheckbox onClick={()=>handleSelectFollowUp(index)}></IonCheckbox>
                                            <IonCol><h5>Follow-up Date: {followUp.followUpDate}</h5></IonCol>
                                            <IonCol><h5>Gender: {followUp.visit.patient.gender}</h5></IonCol>
                                            <IonCol><h5>Address: {followUp.visit.patient.address}</h5></IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonSegment>
                            </IonCardHeader>
                        </IonCard>
                    )}
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={handleSubmit}>SUBMIT</IonButton>
                        </IonCol>
                    </IonRow>
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
            {!showAlert && redirect?<Redirect to={{pathname:'/supervisors/fieldWorkersInHospital',state: { userData: profileData }}}/>
                :null}

        </IonPage>
    )
};

export default AssignTasks;
