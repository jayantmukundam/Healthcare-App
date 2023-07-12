
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
    IonPage, IonRow
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
// setupIonicReact();

import { useState, useEffect } from "react";
import { Redirect } from 'react-router';
import BackButton from "../../components/BackButton";
import RegisterCard from "../../components/RegisterCard";
import LogoutButton from '../../components/LogoutButton';
import AlertLoggedOut from '../../components/AlertLoggedOut';

const Supervisor: React.FC<any> = props => {
    const [profile, setProfile] = useState(props?.location?.state);
    const [profileData, setProfileData] = useState(profile);
    const [auth, setAuth] = useState(true);
    // const [service, setService] = useState("");
    const path="/"

    // const redirectIt = (pathTo:string) => {
    //     setService(pathTo);
    // }

    useEffect(() => {
        console.log(profileData);
        if(!profileData){
            console.log("Login Again..!");
            setAuth(false);
        }
    }, [])
    
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
            {
                !auth ? 
                <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                :null
            }
            <IonRow>
                {/* <BackButton path={path} data={profileData.userData}></BackButton> */}
                <LogoutButton profile = {profile} setProfile = {setProfile} profileData = {profileData} setProfileData = {setProfileData}></LogoutButton>
            </IonRow>

        </IonHeader>

        <IonContent className='ion-padding'/*class = "content-style"*/>

            <IonGrid className='ion-text-center ion-margin ion-padding'>

                {/*<IonSegment>*/}
                <RegisterCard location = {"/supervisors/register"} actor = {"REGISTER"} data = {profileData?.userData}></RegisterCard>
                <RegisterCard location = {"/supervisors/updatePatient"} actor = {"UPDATE PATIENT"} data = {profileData?.userData}></RegisterCard>
                {/* <RegisterCard location = {"/supervisors/delete"} actor = {"DELETE"} data = {profileData?.userData}></RegisterCard> */}
                <RegisterCard location = {"/supervisors/fieldWorkersInHospital"} actor = {"ASSIGN TASKS TO FIELD WORKER"} data = {profileData?.userData}></RegisterCard>
                <RegisterCard location = {"/supervisors/newCase"} actor = {"NEW CASE"} data = {profileData?.userData}></RegisterCard>
                
                {/* <IonCard class = "card-style">
                <IonCardHeader>
                    <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" onClick={() => redirectIt("/supervisors/register")} /*routerLink = "./registerDoctor">REGISTER</IonButton></IonCardTitle>
                </IonCardHeader>
                </IonCard> */}

                {/* <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" onClick={() => redirectIt("/supervisors/updatePatient")} /*routerLink = "./registerDoctor">UPDATE PATIENT</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard> */}

                {/* <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" onClick={() => redirectIt("/supervisors/delete")} /*routerLink = "./registerDoctor">DELETE</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard> */}


                {/* <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" onClick={()=>redirectIt("/supervisors/fieldWorkersInHospital")}>ASSIGN TASKS TO FIELD WORKER</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard> */}

                {/* <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" onClick={() => redirectIt("/supervisors/newCase")} /*routerLink = "./newCase">NEW CASE</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard> */}
            </IonGrid>

            {/* {service !== "" ?
                <Redirect to={{ pathname: `${service}`, state: { userData: profileData.userData } }}/>
            :null} */}

        </IonContent>
    </IonPage>
)
};

export default Supervisor; 
