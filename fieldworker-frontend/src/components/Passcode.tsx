
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
    IonSegment, IonImg, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, generateId, IonAlert, IonCardSubtitle
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
import { Redirect } from "react-router";
import { Network } from "@capacitor/network";
import { usePinStorage } from '../hooks/usePinStorage';
import { useStorageFollowUp } from '../hooks/useStorageFollowUp';

const Passcode: React.FC<any> = () => {
    const [role, setRole] = useState("");
    const userId = useRef<HTMLIonInputElement>(null);

    const [profileData, setProfileData] = useState<any>();

    const dig1 = useRef<HTMLIonInputElement>(null);
    const dig2 = useRef<HTMLIonInputElement>(null);
    const dig3 = useRef<HTMLIonInputElement>(null);
    const dig4 = useRef<HTMLIonInputElement>(null);

    const { getPin } = usePinStorage();

    const [auth, setAuth] = useState(false);

    const [login, setLogin] = useState(false);

    const [tester, setTester] = useState(false);

    const [passcode, setPasscode] = useState();

    const { getFollowups } = useStorageFollowUp();

    const handleTab = (id: number) => {
        if (id == 2)
            dig2.current!.setFocus();
        else if (id == 3)
            dig3.current!.setFocus();
        else if (id == 4)
            dig4.current!.setFocus();
    }

    const pinGenerator = async () => {
        let pinCode = "";

        pinCode += dig1.current!.value;
        pinCode += dig2.current!.value;
        pinCode += dig3.current!.value;
        pinCode += dig4.current!.value;

        // console.log(pinCode);
        // console.log(passcode!["password"])

        if (pinCode === passcode!["password"]) {
            setAuth(true);
        }
    }

    const loginAgain = () => {
        setLogin(true);
    }

    useEffect(() => {
        const res = async () => {
            await getPin().then(async pass => {
                console.log(pass);
                if (pass === null) {
                    console.log("login");
                    setTester(true);
                }
                else {
                    console.log(pass);
                    setPasscode(pass);
                    setTester(false);
                    setLogin(false);
                }
            }
            )

            await getFollowups().then(async data => {
                setProfileData(data[0]!.fieldWorkerInHospital);
            })
        }

        res();
        // console.log(response);
    }, [tester])

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
            <section className='section'>
                        <div className="container-center borders">
                <IonGrid className='ion-padding ion-text-center ion-margin gridStyle'>
                    <header className="headerStyle">WELCOME,</header>
                    <div className="container-center">
                        <h1>Field Worker {profileData?.fieldWorker?.fname}</h1>
                        {/* <img className = "imageHeader" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWY5OTQzMjJmYWVlZDJiMjNjZjUxMjM4ZWI4N2JiMDc4OTc3ZmJkNyZjdD1n/VewYsVXoAV4WVEhYuk/giphy.gif"></img> */}
                        {/* <IonImg src = "public/assets/images/healthWorkerLogo.png"></IonImg> */}
                    </div>
                    <br />
                </IonGrid>
                <IonGrid className='ion-padding ion-text-center ion-margin gridStyle'>
                            <div className="container-center">
                                <h1>ENTER PIN:</h1>
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
                                <IonButton className="ion-margin-top" expand="block" onClick={() => { loginAgain() }}>
                                    FORGET PASSWORD?
                                </IonButton>
                            </IonSegment>

                            <IonSegment>
                                <IonButton className="ion-margin-top" expand="block" onClick={() => { pinGenerator() }}>
                                    SUBMIT
                                </IonButton>
                            </IonSegment>

                            {
                                login ?
                                    <Redirect to="/home"></Redirect>
                                    : null
                            }

                            {
                                auth ?
                                    <Redirect to={{ pathname: `/fieldWorkerInHospital`, state: { userData: profileData } }} />
                                    : null
                            }
                       
                </IonGrid>
                </div>
                    </section>
            </IonContent>
        </IonPage>
    )
};

export default Passcode;