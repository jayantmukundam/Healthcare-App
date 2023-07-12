import {
    IonPage,
    IonCard,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar, IonButton, IonGrid, IonSegment, IonCol, IonRow, IonAlert, IonLabel
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
import './FieldWorker.css';
import {useEffect, useState} from "react";
import { useStorageFollowUp } from '../../hooks/useStorageFollowUp';
import { Redirect } from 'react-router';

import { Network } from "@capacitor/network";

import LogoutButton from "../LogoutButton"
import { base } from '../../api/api';

const FieldWorker: React.FC<any> = props => {

    const [useSt, setUseSt] = useState(false);
    const [redirect,setRedirect] = useState(false);
    const [currFollowup, setCurrFollowup] = useState(null);

    // const f = props.location.state;
    // const [fwid, setFwid] = useState(f);

    const [profile, setProfile] = useState(props?.location?.state);
    const [profileData, setProfileData] = useState(profile?.userData);

    //handling sync..
    // const [on, setOn] = useState(true);
    // const [off, setOff] = useState(false);
    const [offlineAlert, showOfflineAlert] = useState(false);
    //end..

    const {followups, addFollowups} = useStorageFollowUp();

    const review = (followup : any) => {
        setCurrFollowup(followup);
        setRedirect(true);
    }

    const handle = () => {
        console.log('Database updated..!');
        if (useSt)
            setUseSt(false);
        else
            setUseSt(true);
    }

    useEffect(() => {
        console.log(profileData);
        let connection = async() => {
            // console.log(profileData.fwInHospId);
            // console.log(on);
            const connection = await Network.getStatus();

            if(connection.connected){
                showOfflineAlert(false);

                fetch(`${base}followUps/${profileData.fwInHospId}`)
                    .then((response) => response.json())
                    .then(async (json) => {
                        console.log("data fetched");
                        await addFollowups(json);
                    })
            }
            else{
                showOfflineAlert(true);
            }
        }
        connection();
    }, [useSt]);

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
                        <b>FieldWorker</b>
                    </IonTitle>
                </IonToolbar>

                <IonHeader>
                    <IonToolbar>
                        <IonTitle class="ion-text-center">
                            <b>ASSIGNED FOLLOWUPS</b>
                        </IonTitle>
                        
                    </IonToolbar>
                </IonHeader>

            </IonHeader>

            <IonContent className='ion-padding'/*class = "content-style"*/>
                <IonGrid className='ion-text-center ion-margin'>
                    <IonRow>
                        <LogoutButton profile = {profile} setProfile = {setProfile} profileData = {profileData} setProfileData = {setProfileData}></LogoutButton>
                    </IonRow>
                    <IonButton onClick = {handle}>DOWNLOAD</IonButton>
                    {followups.filter(followup => followup.isActive == 1).map(followup =>
                        <IonCard class = "card-style">
                            <IonCardHeader>
                                <IonSegment value = {followup.follow_ups_id} key = {followup.follow_ups_id}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol><h5>{followup.visit.patient.fname}</h5></IonCol>
                                            <IonCol>
                                                <IonButton onClick={() => review(followup)}>PICK</IonButton>
                                                {redirect ? <Redirect from = '/fieldworkers' to={{ pathname: './followup', state: { fupAndProfile: {fup: {currFollowup}, userData:{profileData} }} }} />:null}
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonSegment>
                            </IonCardHeader>
                        </IonCard>
                    )}
                </IonGrid>

                {/* <IonAlert
                    isOpen={offlineAlert}
                    onDidDismiss={() => showOfflineAlert(false)}
                    header= {"NO INTERNET CONNECTION"}
                    buttons={['OK']}
                /> */}
                
            </IonContent>

        </IonPage>
    )
};

export default FieldWorker; 