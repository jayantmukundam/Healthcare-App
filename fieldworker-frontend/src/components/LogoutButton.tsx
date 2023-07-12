import {
    IonButton,
    IonRow
} from '@ionic/react';
import React, {useState} from "react";
import {Redirect} from "react-router";

// interface propsLogout{
//   profile: any;
//   setProfile: any;
//   profileData: any;
//   setProfileData: any;
// }

const LogoutButton: React.FC<any> = ({profile, setProfile, profileData, setProfileData}) => {

  return(
      <IonRow>
          <IonButton onClick = {() => {setProfile(null); setProfileData(null);}} >LOGOUT</IonButton>
                {
                    !profile && !profileData ? 
                        <Redirect to = "/"></Redirect>
                    :null
                }
      </IonRow>
  )
};

export default LogoutButton;
