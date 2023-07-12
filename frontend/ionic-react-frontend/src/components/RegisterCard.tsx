import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton
} from '@ionic/react';
import React, { useState } from "react";
import { Redirect } from "react-router";

interface RegisterCardProps {
    location: string;
    actor: string;
    data: any
}

const RegisterCard: React.FC<RegisterCardProps> = ({ location, actor, data }) => {
    const [service, setService] = useState("");

    const redirectIt = (pathTo: string) => {
        setService(pathTo);
    }

    return (
        <IonCard class="card-style">
            <IonCardHeader>
                <IonCardTitle class="ion-card-title-style"><IonButton fill="clear" size="large" class="btn" onClick={() => redirectIt(location)} /*routerLink = "./registerDoctor"*/>{actor}</IonButton></IonCardTitle>
            </IonCardHeader>

            {
                service !== "" ?
                    <Redirect to={{ pathname: `${service}`, state: { userData: data } }} />
                    : null
            }
        </IonCard>
    )
};

export default RegisterCard;
