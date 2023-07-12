import {
    IonButton,
    IonRow
} from '@ionic/react';
import React, {useState} from "react";
import {Redirect} from "react-router";
import Cookie from 'universal-cookie';

// interface propsLogout{
//   profile: any;
//   setProfile: any;
//   profileData: any;
//   setProfileData: any;
// }

const LogoutButton: React.FC<any> = ({profile, setProfile, profileData, setProfileData}) => {
    const cookie = new Cookie();
  return(
      <IonRow>
          <IonButton onClick = {() => {setProfile(null); cookie.remove("jwt"); setProfileData(null);}} >LOGOUT</IonButton>
                {
                    !profile && !profileData ? 
                        <Redirect to = "/"></Redirect>
                    :null
                }
      </IonRow>
  )
};

export default LogoutButton;
