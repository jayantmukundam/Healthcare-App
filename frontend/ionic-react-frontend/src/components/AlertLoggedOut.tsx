import {
    IonAlert,
    IonSegment
} from '@ionic/react';

import {Redirect} from 'react-router';
import {useState} from 'react';

const AlertLoggedOut: React.FC<any> = ({auth, setAuth}) => {
    const [re, setRe] = useState(false);

  return(
    <IonSegment>
        <IonAlert
            isOpen={!auth}
            onDidDismiss={() => {setRe(true)}}
            header="Invalid Session.. Please Login Again..!"
            buttons={['OK']}
        />
        {
            re?
            <Redirect to = "/"></Redirect>
            :null
        }
    </IonSegment>
  )
};

export default AlertLoggedOut;
