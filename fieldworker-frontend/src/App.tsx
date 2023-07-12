import { IonApp, IonLabel, IonAlert, IonHeader, IonTitle, IonToolbar, setupIonicReact, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import React from "react";

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
import './theme/variables.css';

import Home from './components/Home';
import FWHome from './components/FieldWorker/FWHome';
import FillingRemarks from './components/FieldWorker/FillingRemarks';
import FieldWorker from './components/FieldWorker/FieldWorker';
import FollowUp from './components/FollowUp/FollowUp';
import Passcode from './components/Passcode';
import SetPasscode from './components/SetPasscode';

import { register } from './serviceWorkerRegistration';


import { useState, useEffect } from 'react';
import { Network } from "@capacitor/network";

import { useStorageFillingRemarks } from './hooks/useStorageFillingRemarks';
import { base } from './api/api';

setupIonicReact();

const App: React.FC = () => {

  const [on, setOn] = useState(false);
  const [off, setOff] = useState(false);

  const [offlineAlert, setOfflineAlert] = useState(false);
  const [onlineAlert, setOnlineAlert] = useState(false);

  // const [offlineData, setOfflineData] = useState([]);

  const { remarks, addRemark, getRemarks, updateRemarks } = useStorageFillingRemarks();

  const syncStart = async() => {
    let flag = 1;
    let connection = await Network.getStatus();

    if(connection.connected)
      setOn(true);
    else
      setOn(false);

    getRemarks().then(async offlineData => {
      console.log(offlineData);
        while (connection.connected && offlineData!.length > 0 && flag === 1) {
          // console.log(offlineData[0]['reviewByFieldWorker']);
          // updateRemarks(offlineData);  
          // count--;
          // console.log(offlineData[0]['reviewByFieldWorker']);
          let data = {
            'reviewByFieldWorker': offlineData[0]['reviewByFieldWorker']
          };

          const addRecordEndpoint = `${base}followUps/fieldWorker/${offlineData[0]['followUp'].followUpId}`;
          const options = {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }

           await fetch(addRecordEndpoint, options)
              .then(function (response) {
                console.log(response);
                if (response['status'] === 200) {
                  console.log("DONE");
                  // console.log(task);
                  offlineData.shift();
                  updateRemarks(offlineData);
                } else {
                  console.log("ERROR");
                  flag = 0;
                }
              })
        }
      }
    )
  }

  const status = (status: any) => {
      console.log('Network status changed', status);
      if (status.connected === true) {
        setOn(true);
        setOff(false);
        setOnlineAlert(true);
        setOfflineAlert(false);
        // syncStart();
      }
      else {
        setOn(false);
        setOff(true);
        setOfflineAlert(true);
        setOnlineAlert(false);
      }
  }

  useEffect(() => {
    syncStart();
  }, [on, off])

  useEffect(()=>{
    Network.addListener('networkStatusChange', status);
  },[on, off])
  
  Network.addListener('networkStatusChange', status);

  // Network.addListener('networkStatusChange', status);

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar color={on?"primary":"medium"}>
          <IonTitle className="ion-text-center">
            <b>HEALTHCARE SERVICES</b>
          </IonTitle>
          {on?
            <IonLabel className='status'>Online</IonLabel>
            :
            <IonLabel className='status'>Offline</IonLabel>
          }
        </IonToolbar>
      </IonHeader>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path = "/" component={Passcode}/>
          <Route exact path = "/home" component={Home}/>
          <Route exact path = "/fieldWorkerInHospital" component={FieldWorker}/>
          <Route exact path = "/followup" component={FollowUp}/>
          <Route exact path = "/fieldWorkerHome" component={FWHome}/>
          <Route exact path = "/fillingRemarks" component={FillingRemarks}/>
          <Route exact path = "/setPasscode" component={SetPasscode}/>
        </IonRouterOutlet>
      </IonReactRouter>

      {/* <IonAlert
                    isOpen={offlineAlert}
                    onDidDismiss={() => setOfflineAlert(false)}
                    header= {"CONNECTION LOST..!"}
                    subHeader="Please connect to Internet for Sync"
                    buttons={['OK']}
                />
      <IonAlert
                    isOpen={onlineAlert}
                    onDidDismiss={() => setOnlineAlert(false)}
                    header= {"CONNECTION IS BACK"}
                    subHeader="CONNECTED"
                    buttons={['OK']}
                /> */}
    </IonApp>
  )
};

export default App; 
