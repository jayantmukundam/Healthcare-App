import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, IonCol, IonRow, IonCardHeader, IonCard, IonCardTitle, IonTabBar, IonTabButton, IonAlert, IonDatetime
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
import React, { useEffect, useRef, useState } from 'react';
import BackButton from "../../components/BackButton";
import AdminBackButton from "../../components/AdminBackButton";
import { API_FW_REG } from '../../api/Api';
import Cookie from 'universal-cookie'
import AlertLoggedOut from '../../components/AlertLoggedOut';

const path = "/admin/globalUpdate"
const GlobalUpdateFieldWorker = () => {
    const cookie = new Cookie();
    const[showAlertNoSuchId,setShowAlertNoSuchId] = useState(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [id, setId] = useState(0);
    const [fieldWorker, setFieldWorker] = useState<any>([]);
    const [openForm, setOpenForm] = useState(false);
    const [auth, setAuth] = useState(true)

    const fname = useRef<HTMLIonInputElement>(null)
    const lname = useRef<HTMLIonInputElement>(null)
    const gender = useRef<HTMLIonInputElement>(null)
    const dob = useRef<HTMLIonInputElement>(null)
    const phoneNo = useRef<HTMLIonInputElement>(null)
    const address = useRef<HTMLIonInputElement>(null)
    const registrationDate = useRef<HTMLIonInputElement>(null)

    const resetAll = () => {
        setFieldWorker([])
    }

    const updateFieldWorker = async() => {
        let flag = true;
        let ph = phoneNo.current!.value;
        ph = ph!.toString();
        // console.log(ph.length);
        if(ph[0] !== '+' && ph[1] !== '9' && ph[2]!=='1'){
            flag = false;
        }
        for(let i = 1; i<ph.length; i++){
            if(ph[i]>'9' || ph[i]<'0'){
                console.log(ph[i]);
                flag = false;
            }
        }
        if(ph.length !== 13)
            flag = false;

        console.log(flag);

        if(!flag || fname.current!.value=="" || lname.current!.value=="" || gender.current!.value=="" || dob.current!.value=="" || phoneNo.current!.value=="" || address.current!.value=="" || registrationDate.current!.value==""){
            setShowAlert(true);
            setAlertHeader("Unsuccessful");
            setAlertMessage("Please fill required data..");
            return;
        }
        let data = {
            'fwId': fieldWorker.doctorId,
            'fname': fname.current!.value,
            'lname': lname.current!.value,
            'gender': gender.current!.value,
            'dob': dob.current!.value,
            'phoneNo': phoneNo.current!.value,
            'address': address.current!.value,
            'registrationDate': registrationDate.current!.value,
            'numOfTasksAssignedPerDay': fieldWorker.numOfTasksAssignedPerDay
        }
        console.log(JSON.stringify(data))

        const addRecordEndpoint = `${API_FW_REG}/${fieldWorker.fwId}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+cookie.get("jwt")
            },
            body: JSON.stringify(data)
        }
        await fetch(addRecordEndpoint, options)
        .then(function (response) {
            console.log(response);
            if (response['status'] === 200) {
                console.log("DONE");
                setShowAlert(true);
                setAlertHeader("Data Updated Successfully..")
                setAlertMessage("");
                resetAll();
            } else if(response['status'] === 401) {
                setAuth(false)
            }else {
                console.log("ERROR");
                setShowAlert(true);
                setAlertHeader("Data Updation unsuccessfull..")
                setAlertMessage("");
            }
            return response.json();
        })
    }

    const handle = () => {
        fetch(`${API_FW_REG}/${id}`, {headers : {Authorization: 'Bearer '+cookie.get("jwt")}})
           .then(async (response) => {
            if(response['status'] === 200) {
                const data = await response.json();
                setFieldWorker(data)
                console.log(data)
            } else if(response['status'] === 401) {
                setAuth(false)
            }
            else if(id !== 0) setShowAlertNoSuchId(true);
           })
    }

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
                    <b>ADMIN</b>
                    </IonTitle>
                </IonToolbar>

                <IonRow>
                    <AdminBackButton path={path}/>
                </IonRow>

                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>UPDATE FIELDWORKER</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'/*class = "content-style"*/>

                <IonGrid className='ion-text-center ion-margin'>
                    <IonSegment>
                        <form className="ion-padding">
                            <IonItem>
                                <IonLabel position="floating">ID</IonLabel>
                                <IonInput onIonInput={(e: any) => setId(e.target.value)}/>
                            </IonItem>
                            <IonButton className="ion-margin-top" expand="block" onClick={handle}>
                                Search
                            </IonButton>
                           
                            
                            <IonAlert
                            isOpen={showAlertNoSuchId}
                            onDidDismiss={() => setShowAlertNoSuchId(false)}
                            subHeader="ID NOT FOUND..!"
                            message="!!UNSUCCESSFUL..!"
                            buttons={['OK']}
                            />
                        </form>
                        </IonSegment>
                        {
                            fieldWorker.length != 0 ? (   
                            <><IonCard class="card-style">
                                <IonGrid className='ion-text-center ion-margin'>
                                <IonRow className = "header-border">
                            <IonCol>
                                <IonCardTitle>First Name: </IonCardTitle>
                                <IonCardTitle><IonInput ref={fname} class="card-input" value={fieldWorker.fname}></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Last Name: </IonCardTitle>
                                <IonCardTitle><IonInput ref={lname} class="card-input" value={fieldWorker.lname}></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Gender: </IonCardTitle>
                                <IonCardTitle><IonInput ref={gender} class="card-input" value={fieldWorker.gender}></IonInput></IonCardTitle>
                            </IonCol>
                            </IonRow>
                            <IonRow className='header-border'>
                                <IonCol>
                                    <IonCardTitle>Date of Birth: </IonCardTitle>
                                        <IonCardTitle><IonInput ref={dob} value={fieldWorker.dob} class="card-input"></IonInput></IonCardTitle>
                                </IonCol>
                                <IonCol>
                                    <IonCardTitle>Address: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={address} value={fieldWorker.address} class="card-input"></IonInput></IonCardTitle>
                                </IonCol>
                            </IonRow>
                            <IonRow className='header-border'>
                                <IonCol>
                                    <IonCardTitle>Phone Number: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={phoneNo} value={fieldWorker.phoneNo} class="card-input" type="tel"></IonInput></IonCardTitle>
                                </IonCol>
                                <IonCol>
                                    <IonCardTitle>Registration Date: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={registrationDate} value={fieldWorker.registrationDate} class="card-input"></IonInput></IonCardTitle>
                                </IonCol>
                            </IonRow>
                            </IonGrid>
                            </IonCard>
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonButton onClick={updateFieldWorker}>Submit</IonButton>
                                </IonGrid>
                             </>
                        ) : null
                    }
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
                            buttons={['OK']}/>
                    </IonGrid>
                    </IonContent>
        </IonPage>
    )
}

export default GlobalUpdateFieldWorker;