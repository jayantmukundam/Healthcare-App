
import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonCard,
    IonCardHeader,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, generateId, IonAlert, IonCardSubtitle
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
import '../theme/variables.css';
// import './Admin.css';
import { useState, useRef, useEffect } from "react";
import { useStorageFillingRemarks } from '../hooks/useStorageFillingRemarks';
import {Redirect} from "react-router";
import { Network } from "@capacitor/network";
import { usePinStorage } from '../hooks/usePinStorage';

const SetPasscode: React.FC<any> = (props) => {
    const [profile, setProfile] = useState(props?.location?.state);
    const [profileData, setProfileData] = useState(profile?.userData);

    const [role, setRole] = useState("");
    const userId = useRef<HTMLIonInputElement>(null);

    const dig1 = useRef<HTMLIonInputElement>(null);
    const dig2 = useRef<HTMLIonInputElement>(null);
    const dig3 = useRef<HTMLIonInputElement>(null);
    const dig4 = useRef<HTMLIonInputElement>(null);

    const {pin, addPin, getPin} = usePinStorage();
    
    const otp = useRef<HTMLIonInputElement>(null);

    const [mobileNo, setMobileNo] = useState("");
    const [auth, setAuth] = useState(false);
    const [on, setOn] = useState(false);
    const [offlineAlert, setOfflineAlert] = useState(false);
    const [onlineAlert, setOnlineAlert] = useState(false);

    const [userData, setUserData] = useState();

    const [re, setRe] = useState(false);

    const handleChange = (event: any) => {
        setRole(event.target.value);
        // console.log(event.target.value);
    }

    const handleTab = (id: number) => {
        if(id == 2)
            dig2.current!.setFocus();
        else if(id == 3)
            dig3.current!.setFocus();
        else if(id == 4)
            dig4.current!.setFocus();
    }

    const pinGenerator = async() => {
        let pinCode = "";

        pinCode += dig1.current!.value;
        pinCode += dig2.current!.value;
        pinCode += dig3.current!.value;
        pinCode += dig4.current!.value;

        await addPin(profileData.fwInHospId, pinCode);
        setRe(true);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>HEALTH CARE SERVICES</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding'/*class = "content-style"*/>
            <IonGrid className='ion-padding ion-text-center ion-margin gridStyle'>
                    <header className="headerStyle">WELCOME,</header>
                    <div className="container-center">
                        <h1>Field Worker {profileData?.fieldWorker?.fname}</h1>
                    </div>
                    <br />
                </IonGrid>
                <IonGrid className='ion-padding ion-text-center ion-margin gridStyle'>
                    <section className='section'>
                        <div className="container-center borders">
                            <div className="container-center">
                                <h1><u>SET PIN:</u></h1>
                            </div>

                            <IonSegment>
                                <IonCard className="changeSize">
                                    <IonLabel position="floating" className="changeSize"></IonLabel>
                                    <IonInput maxlength={1} ref={dig1} type="password" onIonChange={() => handleTab(2)} />
                                </IonCard>
                                <IonCard className="changeSize">
                                    <IonLabel position="floating" className="changeSize"></IonLabel>
                                    <IonInput maxlength={1} ref={dig2} type="password" onIonChange={() => handleTab(3)} />
                                </IonCard>
                                <IonCard className="changeSize">
                                    <IonLabel position="floating" className="changeSize"></IonLabel>
                                    <IonInput maxlength={1} ref={dig3} type="password" onIonChange={() => handleTab(4)} />
                                </IonCard>
                                <IonCard className="changeSize">
                                    <IonLabel position="floating" className="changeSize"></IonLabel>
                                    <IonInput maxlength={1} ref={dig4} type="password" />
                                </IonCard>
                            </IonSegment>

                            <IonSegment>
                                <IonButton className="ion-margin-top" expand="block" onClick={() => { pinGenerator() }}>
                                    SUBMIT
                                </IonButton>
                            </IonSegment>
                        </div>
                    </section>
                </IonGrid>

                {
                    re ? 
                    <Redirect to={{ pathname: `./fieldWorkerInHospital`, state: { userData: profileData } }}/>
                    :null
                }
                
            </IonContent>
        </IonPage>
    )
};

export default SetPasscode;