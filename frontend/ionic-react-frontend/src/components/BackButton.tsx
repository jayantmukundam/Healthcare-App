import {
    IonContent,
    IonGrid,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonPage,
    IonSegment, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonInput, generateId, IonAlert, IonRow
} from '@ionic/react';
import React, {useState} from "react";
import {Redirect} from "react-router";

interface BackButtonProps {
    path: any;
    data:any;
}

const BackButton: React.FC<BackButtonProps>= ({path,data}) => {
    const [service, setService] = useState("");

    const redirectIt = (path:string) => {
        setService(path);
    }

  return(
      <IonRow>
          <IonButton onClick={()=>redirectIt(path)}>Back</IonButton>
    {service !== "" ?
        <Redirect to={{ pathname: `${service}`, state: { userData: data } }}/>
        :null}

      </IonRow>


  )
};

export default BackButton;
