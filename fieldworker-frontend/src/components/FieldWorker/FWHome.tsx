import { IonPage, IonContent, IonButton, IonLabel, IonItem, IonInput, IonSegment, IonHeader, IonTitle, IonToolbar, setupIonicReact, IonRouterOutlet } from '@ionic/react';
// import { IonReactRouter } from "@ionic/react-router";
// import { Route } from "react-router-dom";
import { Redirect } from 'react-router';
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
import FillingRemarks from './FillingRemarks';
import { useRef, useState, useEffect, Component } from 'react';

// import { useStorage } from '../../hooks/useStorage';

// setupIonicReact();

const FWHome: React.FC = () => {

    const fid = useRef<HTMLIonInputElement>(null);
    const [fill, setFill] = useState(false);

    const fillForm = () => {
        setFill(true);
        console.log(fid.current!.value);
    }
    // <FillingRemarks patientId = {fid.current!.value}
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle class="ion-text-center">
                        <b>HEALTHCARE SERVICES</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">
                        <b>FIELD WORKER</b>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonSegment>
                    <form className="ion-padding">
                        <IonItem>
                            <IonLabel position="floating">Follow-Up ID</IonLabel>
                            <IonInput ref={fid} />
                        </IonItem>
                        <IonButton className="ion-margin-top" expand="block" onClick={(fillForm)}>
                            Fill Remarks
                        </IonButton>
                    </form>
                </IonSegment>

                {fill ? <Redirect to={{ pathname: '/fillingRemarks', state: { followupId: fid.current!.value } }} /> : null}
            </IonContent>
        </IonPage>
    )
};

export default FWHome;