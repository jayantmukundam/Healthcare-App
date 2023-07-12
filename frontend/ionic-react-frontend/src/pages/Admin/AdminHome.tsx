import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, IonCol, IonRow, IonCardHeader, IonCard, IonCardTitle
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
import React, { useEffect, useState } from 'react';
import BackButton from "../../components/BackButton";
import AdminBackButton from "../../components/AdminBackButton";
import AlertLoggedOut from '../../components/AlertLoggedOut';
import LogoutButton from '../../components/LogoutButton';
const path='/'
const AdminHome: React.FC<any> = (props) => {
    const [profile, setProfile] = useState(props?.location?.state);
    const [profileData, setProfileData] = useState(profile);
    const [auth, setAuth] = useState(true);
    useEffect(() => {
        console.log(profileData);
        if(!profileData){
            console.log("Login Again..!");
            setAuth(false);
        }
    }, [])
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
                    <b>Admin</b>
                    </IonTitle>
                </IonToolbar>
                {
                !auth ? 
                <AlertLoggedOut auth = {auth} setAuth = {setAuth}></AlertLoggedOut>
                :null
            }
            <IonRow>
                <LogoutButton profile = {profile} setProfile = {setProfile} profileData = {profileData} setProfileData = {setProfileData}></LogoutButton>
            </IonRow>
            </IonHeader>



            <IonContent className='ion-padding'/*class = "content-style"*/>

            <IonGrid className='ion-text-center ion-margin ion-padding'>

                <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" routerLink = "/admin/globalRegister">REGISTER</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard>

                <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" routerLink = "/admin/globalUpdate">UPDATE</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard>

                {/* <IonCard class = "card-style">
                    <IonCardHeader>
                        <IonCardTitle class = "ion-card-title-style"><IonButton fill = "clear" size = "large" class = "btn" routerLink = "./globalSearch">SEARCH</IonButton></IonCardTitle>
                    </IonCardHeader>
                </IonCard> */}
            </IonGrid>

        </IonContent>
        </IonPage>
    )
};

export default AdminHome;
