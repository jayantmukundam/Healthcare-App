import {
    IonButton,
    IonRow,
    IonAlert,
    IonSegment
} from '@ionic/react';
import React, {useState} from "react";

// interface alertStruct {
//   alert: boolean,
//   showAlert: typeof useState<boolean>,
//   headAlert: string,
//   msgAlert: string
// }

const ShowAlert: React.FC<any> = ({alert, showAlert, headAlert, msgAlert}) => {
  return(
    <IonSegment>
      <IonAlert
        isOpen={alert}
        onDidDismiss={() => {showAlert(false)}}
        header= {`${headAlert}`}
        message= {`${msgAlert}`}
        buttons={['OK']}
      />
      </IonSegment>
  )
};

export default ShowAlert;
