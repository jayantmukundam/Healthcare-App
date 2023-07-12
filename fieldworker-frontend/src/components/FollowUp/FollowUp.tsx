import {
    IonPage,
    IonCard,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar, IonButton, IonGrid, IonSegment, IonCol, IonRow, IonCardTitle, IonInput, IonItem, IonLabel, IonAlert
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
import './FollowUp.css';
import React, {useState, useRef} from "react";
import { Redirect } from 'react-router';

const FollowUp: React.FC<any> = props => {
    const followupDetails = props.location.state;
    const userVerif = useRef<HTMLIonInputElement>(null);
    const [userData,setNewF] = useState(followupDetails.fupAndProfile);

    const [redirect, setRedirect] = useState(false);
    const [show, setShow] = useState(false);

    const compareVerifNo = userData.fup.currFollowup.verificationNumber;

    const review = () => {
        // setRedirect(true);
        if(userVerif === compareVerifNo){
            setRedirect(true);
            setShow(false);
        }

        else{
            setShow(true);
            setRedirect(false);
        }
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
                    <b>Authenticate Patient</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid class='ion-text-center'>
                        <IonCol><h5>Patient Name: {userData.fup.currFollowup.visit.patient.fname}</h5></IonCol>   
                        <IonCol><h5>Address: {userData.fup.currFollowup.visit.patient.address}</h5></IonCol>
                        <IonSegment>
                        <form className="ion-padding">
                            <IonItem>
                                <IonLabel position="floating">Enter OTP</IonLabel>
                                <IonInput ref = {userVerif} type="password" />
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={(review)}>
                                Review
                            </IonButton>
                            {redirect? 
                            <Redirect to={{ pathname: '/fillingRemarks', state: { userData: {userData} } }} />
                            :
                            <IonAlert
                                isOpen={show}
                                onDidDismiss={() => setShow(false)}
                                header= {"Wrong Verification Code"}
                                subHeader="Please try again"
                                buttons={['OK']
                            }
                />}
                        </form>
                    </IonSegment>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default FollowUp;