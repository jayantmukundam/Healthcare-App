
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
import * as apis from '../../api/Api'
import Cookies from 'universal-cookie';


// setupIonicReact();
const ViewPatientHistory: React.FC<any> = props => {
    const cookie = new Cookies();
    const f = props.location.state;
    const [currCase, setCurrCase] = useState(f.visitDetails);
    const [profileData, setProfileData] = useState(f.userData);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [redirect, setRedirect] = useState(false);
    const [showFollowUpOption, setShowFollowUpOption] = useState(false);
    const [visits, setVisits] = useState<any[]>([]);
    const [followUps, setFollowUps] = useState<any[]>([]);
    const [visitExpanded, setVisitExpanded] = useState<boolean[]>([false]);
    const [followUpExpanded,setFollowUpExpanded] = useState<boolean[]>([false]);
    const [symptomList, setSymptomList] = useState<string[]>([])
    const [prescriptionList, setPrescriptionList] = useState<string[]>([])
    const followUpDate = useRef<HTMLIonDatetimeElement>(null);
    const [oldTaskList, setOldTaskList] = useState<string[]>([])
    const [oldReviewList, setOldReviewList] = useState<string[]>([])
    const [symptomsExpanded, setSymptomsExpanded] = useState<boolean[]>([false])
    const [prescriptionExpanded, setPrescriptionExpanded] = useState<boolean[]>([false])

    const path = "/doctorInHospital/patient"

    useEffect(() => {
        fetch(`${apis.API_VIS}/${currCase.visitId}/patient/${currCase?.patient?.patientId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then((response) => response.json())
            .then((json) => {
                setVisits(json);
                return json;
            })
    }, []);

    const handleBack=()=>{
        setRedirect(true)
    }

    const handleExpandVisit = async(index: any,visit:any) => {
        const symptoms = visit.symptoms.split("\n")
        const prescription = visit.prescription.split("\n")
        setSymptomList(symptoms)
        setPrescriptionList(prescription)
        await fetch(`${apis.API_FOLLOWUP_VIS}/${visit.visitId}/followUpId/-1`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then((response) => response.json())
            .then((json) => {
                // setUseSt(true);
                setFollowUps(json);
                return json;
            })
        let newArray = [...visitExpanded];
        if (newArray[index] === true)
            newArray[index] = false;

        else
            newArray[index] = true;
        setVisitExpanded(newArray);
    }

    const handleExpandSymptoms = (index:any)=>{
        let newArray = [...symptomsExpanded];
        if (newArray[index] === true)
            newArray[index] = false;

        else
            newArray[index] = true;
        setSymptomsExpanded(newArray);
    }

    const handleExpandPrescriptions = (index:any)=>{
        let newArray = [...prescriptionExpanded];
        if (newArray[index] === true)
            newArray[index] = false;

        else
            newArray[index] = true;
        setPrescriptionExpanded(newArray);
    }

    const handleExpandFollowUp = (index: any) => {
        const tasks = followUps[index].taskAssignedByDoctor.split("$")
        const reviews = followUps[index].reviewByFieldWorker.split("$")
        setOldTaskList(tasks)
        setOldReviewList(reviews)
        let newArray = [...followUpExpanded];
        if (newArray[index] === true)
            newArray[index] = false;

        else
            newArray[index] = true;
        setFollowUpExpanded(newArray);
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
                    <IonButton onClick={handleBack}>Back</IonButton>
                </IonRow>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>FOLLOW-UP DETAILS</b>
                    </IonTitle>
                </IonToolbar>

            </IonHeader>

            <IonContent className='ion-padding'>
            <IonCard>

                    <IonRow class="ion-text-center">
                        <IonCol>
                            <h3>Visits</h3>
                        </IonCol>
                    </IonRow>
                    {visits.map((visit, index) =>
                        <IonCard class="card-style">
                            <IonCardHeader>
                                <IonSegment>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonButton onClick={() => handleExpandVisit(index,visit)}>Visit {index + 1} details</IonButton>
                                                {visitExpanded[index] &&
                                                    <IonCol class="ion-text-center">
                                                        <h5>Visit Date: {visit.visitDate}</h5>
                                                        <IonCol class="ion-text-center">
                                                        <IonButton onClick={()=>handleExpandSymptoms(index)}>Symptoms</IonButton>
                                                        {symptomsExpanded[index] &&
                                                            <IonCol>
                                                            {symptomList.map((symptom: any) =>
                                                                    <IonRow>
                                                                        <IonCol>
                                                                            <h6 className={"item-border"}>{symptom}</h6>
                                                                        </IonCol>
                                                                    </IonRow>)
                                                            }
                                                        </IonCol>
                                                        }

                                                        <IonButton onClick={()=>handleExpandPrescriptions(index)}>Prescriptions</IonButton>
                                                        {prescriptionExpanded[index] &&
                                                            <IonCol>
                                                                {prescriptionList.map((prescription: any) =>
                                                                    <IonRow>
                                                                        <IonCol>
                                                                            <h6 className={"item-border"}>{prescription}</h6>
                                                                        </IonCol>
                                                                    </IonRow>)
                                                                }
                                                            </IonCol>
                                                        }
                                                        </IonCol>
                                                        <h5>Follow ups:</h5>
                                                        {followUps.map((followUp, index) =>
                                                            <IonCard class="card-style">
                                                                <IonCardHeader>
                                                                    <IonSegment>
                                                                        <IonGrid>
                                                                            <IonRow>
                                                                                <IonCol>
                                                                                    <IonButton onClick={() => handleExpandFollowUp(index)}>Follow-up {index + 1} details</IonButton>
                                                                                    {followUpExpanded[index] &&
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
                                                    </IonCol>
                                                }


                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonSegment>
                            </IonCardHeader>
                        </IonCard>
                    )}
                {redirect && <Redirect to={{pathname:'/doctorInHospital/patient',state: {currCase,userData: profileData }}}/>}



            </IonCard>
            </IonContent>

        </IonPage>


    )
};

export default ViewPatientHistory;