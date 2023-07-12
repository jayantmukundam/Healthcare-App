
import {
    IonPage,
    IonCard,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar, IonButton, IonGrid, IonSegment, IonCol, IonRow
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

/* Theme variables */
import '../../theme/variables.css';
import './Doctor.css';
import React, {useEffect, useState} from "react";

import {Redirect} from "react-router";
import BackButton from "../../components/BackButton";
import LogoutButton from '../../components/LogoutButton';
import AlertLoggedOut from '../../components/AlertLoggedOut';

import { API_ACTIVE_VIS, API_FOLLOWUP_DOC_END, API_FOLLOWUP_DOC_REV, API_VIS } from '../../api/Api';
import Cookie from 'universal-cookie'

import * as apis from '../../api/Api';

// setupIonicReact();

const DoctorHome: React.FC<any> = props => {
    const cookie = new Cookie();
    const [profile, setProfile] = useState(props?.location?.state);
    const [profileData, setProfileData] = useState(profile);

    const [activeCases, setActiveCases] = useState<any[]>([]);
    const [activeFollowUps, setActiveFollowUps] = useState<any[]>([]);

    // const [redirect, setRedirect] = useState(false);

    const [useSt, setUseSt] = useState(false);
    const [redirectToPatient,setRedirectToPatient] = useState(false);
    const [redirectToFollowUp,setRedirectToFollowUp] = useState(false);

    const [currCase, setCurrCase] = useState(null);
    const [currFollowUp, setCurrFollowUp] = useState(null);
    const [auth, setAuth] = useState(true);

    const [newPatient,setNewPatient] = useState(true);
    const [oldFollowUps, setOldFollowUps] = useState(false);
    const path = "/"

    const [colorNewCases, setcolorNewCases] = useState("primary");
    const [colorReview, setColorReview] = useState("dark");

    const deactivate = (cases:any) => {
        setCurrCase(cases);
        setRedirectToPatient(true);
    }

    const handle = () => {
        console.log('Database updated..!');


        if (useSt){
            setUseSt(false);
        }
            
        else
            setUseSt(true);
    }

    const pickFollowUp = (followUp:any)=>{
        setCurrFollowUp(followUp)
        setRedirectToFollowUp(true)
    }

    const handleNewPatientList=()=>{
        setcolorNewCases("primary");
        setColorReview("dark");
        setNewPatient(true);
        setOldFollowUps(false);
    }
    const handleOldFollowUpList=()=>{
        setcolorNewCases("dark");
        setColorReview("primary");
        setOldFollowUps(true);
        setNewPatient(false);
    }

    useEffect(() => {
        if(!profileData || profileData === undefined || profileData.userData.docInHospId === undefined){
            console.log("Login Again..!");
            setAuth(false);
        }
        else{
            const hospitalId = profileData?.userData?.hospital?.hospitalId
            const currId = profileData?.userData?.docInHospId
            fetch(`${apis.API_ACTIVE_VIS}/${hospitalId}/docInHosp/${currId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
                .then((response) => {
                    if(response['status'] === 401) setAuth(false);
                    return response.json()
                })
                .then((json) => {
                    setActiveCases(json);

                    return json;
                })
            }
    },[useSt]);

    useEffect(() => {
        if(!profileData || profileData === undefined || profileData.userData.docInHospId === undefined){
            console.log("Login Again..!");
            setAuth(false);
        }
        else{
            fetch(`${apis.API_FOLLOWUP_DOC_REV}/${profileData?.userData?.docInHospId}`, {headers: {Authorization: 'Bearer '+cookie.get("jwt")}})
            .then((response) => {
                if(response['status'] === 401) setAuth(false);
                return response.json()
            })
            .then((json) => {
                setActiveFollowUps(json);

                return json;
            })
        }
    },[useSt]);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>HEALTHCARE SERVICES</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>DOCTOR</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            {
                !auth ? 
                <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                :null
            }
            <IonRow>
                {/* <BackButton path={path} data={profileData.userData}></BackButton> */}
                <LogoutButton profile = {profile} setProfile = {setProfile} profileData = {profileData} setProfileData = {setProfileData}></LogoutButton>
            </IonRow>
                    {/*<IonGrid>*/}
            <IonContent className='ion-padding'/*class = "content-style"*/>

            <IonRow>
                        <IonCol>
                            <IonButton expand = "full" color={colorNewCases} onClick={handleNewPatientList}>New Cases</IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton expand = "full" color={colorReview} onClick={handleOldFollowUpList}>Review Followups</IonButton>
                        </IonCol>
                    </IonRow>
                    {/*</IonGrid>*/}

            {newPatient &&
                // <IonHeader>
                    <IonToolbar>
                        <IonTitle class="ion-text-center">
                            <b>NEW CASES</b>
                        </IonTitle>
                    </IonToolbar>
                // </IonHeader>
            }
            {
                oldFollowUps &&
                // <IonHeader>
                    <IonToolbar>
                        <IonTitle class="ion-text-center">
                            <b>REVIEW FOLLOWUPS</b>
                        </IonTitle>
                    </IonToolbar>
                // </IonHeader>
            }

            {newPatient &&
                <IonContent className='ion-padding'/*class = "content-style"*/>
                    <IonGrid className='ion-text-center ion-margin'>
                        <IonButton onClick={handle}>REFRESH</IonButton>
                        {activeCases.map(cases =>
                            <IonCard class="card-style">
                                <IonCardHeader>
                                    <IonSegment value={cases.visitId} key={cases.visitId}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol><h5>Patient ID: {cases.patient.patientId}</h5></IonCol>
                                                <IonCol><h5>Patient Name: {cases.patient.fname}</h5></IonCol>
                                                <IonCol>
                                                    <IonButton onClick={() => deactivate(cases)}>PICK</IonButton>

                                                    { redirectToPatient ? <Redirect
                                                        to={{pathname: '/doctorInHospital/patient', state: {currCase,userData:profile.userData}}}/> : null}
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonSegment>
                                </IonCardHeader>
                            </IonCard>
                        )}
                    </IonGrid>
                </IonContent>
            }

            {oldFollowUps &&
                <IonContent className='ion-padding'/*class = "content-style"*/>
                    <IonGrid className='ion-text-center ion-margin'>
                        <IonButton onClick={handle}>REFRESH</IonButton>
                        {activeFollowUps.map(followUp =>
                            <IonCard class="card-style">
                                <IonCardHeader>
                                    <IonSegment value={followUp.visit.visitId} key={followUp.visit.visitId}>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol><h5>Patient ID: {followUp.visit.patient.patientId}</h5></IonCol>
                                                <IonCol><h5>Patient Name: {followUp.visit.patient.fname}</h5></IonCol>
                                                <IonCol>
                                                    <IonButton onClick={()=>pickFollowUp(followUp)}>PICK</IonButton>

                                                    {redirectToFollowUp ? <Redirect
                                                        to={{pathname: '/doctorInHospital/oldFollowUp', state: {currFollowUp,userData:profile.userData}}}/> : null}
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonSegment>
                                </IonCardHeader>
                            </IonCard>
                        )}
                    </IonGrid>
                </IonContent>
            }

            </IonContent>

        </IonPage>
        
    )
};

export default DoctorHome;