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
import React from "react";
import {Redirect} from "react-router";

interface AdminBackButtonProps {
    path: any;
}

const AdminBackButton: React.FC<AdminBackButtonProps>= ({path}) => {
    return(
            <IonButton routerLink={path}>Back</IonButton>

    )
};

export default AdminBackButton;
