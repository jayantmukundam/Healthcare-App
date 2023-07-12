
import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, generateId, IonAlert
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
import { base } from '../api/api';

//remove
// //print prescription:

// import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

// //remove

// setupIonicReact();

const Home: React.FC<any> = () => {
    // //remove

    // //printing prescription:
    // const pdfDownload = () => {
    //     console.log("print");
    //     const docDef = {
    //       content: [
    //         'HOSPITAL DETAILS:',
    //         {
    //           ul: [
    //             `HOSPITAL NAME: Tushar`,
    //             `HOSPITAL ADDRESS: Nagpal`,
    //           ]
    //         },
    //       ],
    //     };

    //     const pdfDown = pdfMake.createPdf(docDef);
        
    //     pdfDown.getBase64((dataBase64) => {
    //         const fileName = 'PDF-base64.pdf';
    //         Filesystem.writeFile({
    //             path: fileName,
    //             data: dataBase64,
    //             directory: Directory.Documents,
    //             encoding: Encoding.UTF8
    //         }).then(writeFileResponse => {
    //             // alert("Done");
    //             console.log('writeFile success => ', writeFileResponse);
    //         }, error => {
    //             console.log('writeFile error => ', error);
    //         });
    //     });
    //   }

    // //remove

    // const patientIdRef = useRef<HTMLIonInputElement>(null);
    // const [task, setTask] = useState('');
    const [alertIdFound, setAlertIdFound] = useState(true);
    const [alertOtpGen, setAlertOtpGen] = useState(false);
    const [alertUnauth, setAlertUnauth] = useState(false);

    const [role, setRole] = useState("");
    const userId = useRef<HTMLIonInputElement>(null);
    const otp = useRef<HTMLIonInputElement>(null);
    // const [valid, setValid] = useState(false);
    const [mobileNo, setMobileNo] = useState("");
    const [auth, setAuth] = useState(false);
    const [on, setOn] = useState(false);
    const [offlineAlert, setOfflineAlert] = useState(false);
    const [onlineAlert, setOnlineAlert] = useState(false);

    const [userData, setUserData] = useState();

    // const handleChange = (event: any) => {
    //     setRole(event.target.value);
    //     // console.log(event.target.value);
    // }

    const generate = () => {
        fetch(`${base}fieldWorkerInHospital/phoneNo/${userId.current!.value}`)
            .then((response) => {
                // console.log(response.text());
                if (response['status'] === 200) {
                    console.log("Found entry");
                    return response.text();
                }
                else {
                    console.log("No such entry..!");
                    setAlertIdFound(false);
                    return "-1";
                }
            })
            .then((data) => {
                // console.log(data);
                if(data === "-1"){
                    console.log("Try again..!");
                }
                else{
                    setMobileNo(data);
                    fetch(`${base}phoneNumber/generateOTP/${data}`)
                    .then(function (response) {
                        console.log(response);
                        if (response['status'] === 200) {
                            console.log("OTP Sent to Registered Mobile Number");
                        }
                        else {
                            console.log("Please Enter a valid Phone Number");
                            setAlertOtpGen(true);
                        }
                    }
                )}})
    }

    const authenticate = () => {
        // setAuth(true);
        // verifyOTP:
        console.log(otp.current!.value);
        console.log(mobileNo);
        fetch(`${base}phoneNumber/verifyOTP/${otp.current!.value}/${mobileNo}`)
            .then(function (response) {
                console.log(response);
                if (response['status'] === 200) {
                    fetch(`${base}fieldWorkerInHospital/${userId.current!.value}`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then((data) => {
                        setUserData(data);
                        console.log("OTP Validated");
                        setAuth(true);
                    })
                }
                else {
                    console.log("OTP mismatch Sorry..!");
                    setAlertUnauth(true);
                    setAuth(false);
                }
            })
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

            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>LOGIN PAGE</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className='ion-padding'/*class = "content-style"*/>
                    <IonAlert
                        isOpen={!alertIdFound}
                        onDidDismiss={() => setAlertIdFound(true)}
                        header= {"NO SUCH ID FOUND. TRY AGAIN!"}
                        buttons={['OK']}
                    />
                    <IonAlert
                        isOpen={alertOtpGen}
                        onDidDismiss={() => setAlertOtpGen(false)}
                        header= {"There is some problem with sending OTP on your mobile number please contact admin."}
                        buttons={['OK']}
                    />
                    <IonAlert
                        isOpen={alertUnauth}
                        onDidDismiss={() => setAlertUnauth(false)}
                        header= {"Incorrect OTP please try again..!"}
                        buttons={['OK']}
                    />

                <IonGrid className='ion-text-center ion-margin'>

                    <IonList className="ion-select-style">
                        <IonItem>
                            {/* <IonSelect interface="action-sheet" placeholder="LOGIN AS" onIonChange={handleChange}>
                                <IonSelectOption value="admin">ADMIN</IonSelectOption>
                                <IonSelectOption value="supervisors">SUPERVISOR</IonSelectOption>
                                <IonSelectOption value="doctorInHospital">DOCTOR</IonSelectOption>
                                <IonSelectOption value="fieldWorkerInHospital">FIELD WORKER</IonSelectOption>
                            </IonSelect> */}
                            <IonLabel>FIELD WORKER</IonLabel>
                        </IonItem>
                    </IonList>

                    <IonSegment>
                        <form className="ion-padding">
                            <IonItem>
                                <IonLabel position="floating">ID</IonLabel>
                                <IonInput ref={userId} />
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={() => generate()}>
                                GENERATE OTP
                            </IonButton>
                            <IonItem>
                                <IonLabel position="floating">OTP</IonLabel>
                                <IonInput ref={otp} type="password" />
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={() => authenticate()}/*routerLink = {`./${role}`}*/>
                                Login
                            </IonButton>

                            {
                                auth ?
                                // <Redirect to={{ pathname: `./${role}`, state: { userData: userData } }}/>
                                <Redirect to={{pathname: '/setPasscode', state: { userData: userData } }}/>
                            :null}
                        </form>

                        {/*<IonButton className="ion-margin-top" expand="block" onClick={() => pdfDownload()}/*routerLink = {`./${role}`}>
                                PDF
                        </IonButton> */}
                    </IonSegment>

                </IonGrid>

            </IonContent>
        </IonPage>
    )
};

export default Home;
