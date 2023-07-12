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
import { API_HOSP_NOSUP, API_SUP_REG } from '../../api/Api';
import Cookie from 'universal-cookie';

const path = "/admin/globalUpdate"
const GlobalUpdateSupervisor = () => {
    const cookie = new Cookie();
    const [showAlertNoSuchId, setShowAlertNoSuchId] = useState(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertHeader, setAlertHeader] = useState<string>()
    const [id, setId] = useState(0);
    const [supervisor, setSupervisor] = useState<any>([]);
    const [openForm, setOpenForm] = useState(false);
    const [auth, setAuth] = useState(true);
    const [hospitalId, setHospitalId] = useState(null);

    const fname = useRef<HTMLIonInputElement>(null)
    const lname = useRef<HTMLIonInputElement>(null)
    const gender = useRef<HTMLIonInputElement>(null)
    const dob = useRef<HTMLIonInputElement>(null)
    const phoneNo = useRef<HTMLIonInputElement>(null)
    const address = useRef<HTMLIonInputElement>(null)
    const registrationDate = useRef<HTMLIonInputElement>(null)
    const [hospitalOptions, setHospitalOptions] = useState<any[]>([]);

    const resetAll = () => {
        setSupervisor([])
    }

    const updateSupervisor = async() => {
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
            'supervisorId': supervisor.supervisorId,
            'fname': fname.current!.value,
            'lname': lname.current!.value,
            'gender': gender.current!.value,
            'dob': dob.current!.value,
            'phoneNo': phoneNo.current!.value,
            'address': address.current!.value,
            'registrationDate': registrationDate.current!.value,
            'hospital': {'hospitalId': hospitalId}
        }
        console.log(JSON.stringify(data))

        const addRecordEndpoint = `${API_SUP_REG}/${supervisor.supervisorId}`;
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

        fetch(`${API_HOSP_NOSUP}`, {headers : {Authorization: 'Bearer '+cookie.get("jwt")}})
           .then(function(response) {
            if(response['status'] === 401) {
                setAuth(false)
            }
            return response.json()})
           .then((json) => {
               setHospitalOptions(json);
         })
    }

    const handle = () => {
        fetch(`${API_SUP_REG}/${id}`, {headers : {Authorization: 'Bearer '+cookie.get("jwt")}})
           .then(async (response) => {
            if(response['status'] === 200) {
                const data = await response.json();
                setSupervisor(data)
                setHospitalId(data.hospital.hospitalId)
                console.log(data)
            } else if(response['status'] === 401) {
                setAuth(false)
            }
            else if(id !== 0) setShowAlertNoSuchId(true);
           })

           fetch(`${API_HOSP_NOSUP}`)
           .then(function(response) {
                if(response['status'] === 401) setAuth(false)
                return response.json()
            })
           .then((json) => {
               setHospitalOptions(json);
           })
    }

        const selectHospital = (event: any) =>{
            setHospitalId(event.target.value);
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
                        <b>UPDATE SUPERVISOR</b>
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
                            supervisor.length != 0 ? (   
                            <><IonRow className='header-border'>
                                <IonCol><IonCardTitle>Select Hospital: </IonCardTitle></IonCol>
                                <IonCol>
                            <IonList>
                                <IonItem>
                                    <IonSelect interface="action-sheet" placeholder={supervisor.hospital.name} onClick={handle} onIonChange={selectHospital}>
                                    {
                                        hospitalOptions.map(hospital => 
                                            <IonSelectOption value={hospital.hospitalId}>{hospital.name}</IonSelectOption>
                                        )
                                    }
                                    </IonSelect>
                                </IonItem>
                            </IonList>
                            </IonCol>
                            </IonRow>
                            <IonCard class="card-style">
                                <IonGrid className='ion-text-center ion-margin'>
                                <IonRow className = "header-border">
                            <IonCol>
                                <IonCardTitle>First Name: </IonCardTitle>
                                <IonCardTitle><IonInput ref={fname} class="card-input" value={supervisor.fname}></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Last Name: </IonCardTitle>
                                <IonCardTitle><IonInput ref={lname} class="card-input" value={supervisor.lname}></IonInput></IonCardTitle>
                            </IonCol>
                            <IonCol>
                                <IonCardTitle>Gender: </IonCardTitle>
                                <IonCardTitle><IonInput ref={gender} class="card-input" value={supervisor.gender}></IonInput></IonCardTitle>
                            </IonCol>
                            </IonRow>
                            <IonRow className='header-border'>
                                <IonCol>
                                    <IonCardTitle>Date of Birth: </IonCardTitle>
                                        <IonCardTitle><IonInput ref={dob} value={supervisor.dob} class="card-input"></IonInput></IonCardTitle>
                                </IonCol>
                                <IonCol>
                                    <IonCardTitle>Address: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={address} value={supervisor.address} class="card-input"></IonInput></IonCardTitle>
                                </IonCol>
                            </IonRow>
                            <IonRow className='header-border'>
                                <IonCol>
                                    <IonCardTitle>Phone Number: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={phoneNo} value={supervisor.phoneNo} class="card-input" type="tel"></IonInput></IonCardTitle>
                                </IonCol>
                                <IonCol>
                                    <IonCardTitle>Registration Date: </IonCardTitle>
                                    <IonCardTitle><IonInput ref={registrationDate} value={supervisor.registrationDate} class="card-input"></IonInput></IonCardTitle>
                                </IonCol>
                            </IonRow>
                            </IonGrid>
                            </IonCard>
                                <IonGrid className='ion-text-center ion-margin'>
                                    <IonButton onClick={updateSupervisor}>Submit</IonButton>
                                </IonGrid>
                             </>
                        ) : null
                    }
                    <IonAlert
                                isOpen={showAlert}
                                onDidDismiss={() => setShowAlert(false)}
                                header={alertHeader}
                                message={alertMessage}
                                buttons={['OK']}
                                /> 
                    </IonGrid>
                </IonContent>
        </IonPage>
    )
}

export default GlobalUpdateSupervisor;