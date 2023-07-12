import { IonApp, IonAlert, IonHeader, IonTitle, IonToolbar, setupIonicReact, IonRouterOutlet } from '@ionic/react';
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
import NewCase from "./pages/Supervisor/NewCase";
import DoctorHome from "./pages/Doctor/DoctorHome";
import Supervisor from "./pages/Supervisor/Supervisor";
import RegisterDoctor from './pages/Supervisor/RegisterDoctor';
import RegisterPatient from "./pages/Supervisor/RegisterPatient";
// import FWHome from './pages/FieldWorker/FWHome';
// import FillingRemarks from './pages/FieldWorker/FillingRemarks';
// import FieldWorker from './pages/FieldWorker/FieldWorker';
// import FollowUp from './pages/FieldWorker/FollowUp';

import Register from "./pages/Supervisor/Register";
import RegisterFieldWorker from "./pages/Supervisor/RegisterFieldWorker";
import Delete from "./pages/Supervisor/Delete";
import DeleteDoctor from "./pages/Supervisor/DeleteDoctor";
import UpdatePatient from "./pages/Supervisor/UpdatePatient";
import DeleteFieldWorker from "./pages/Supervisor/DeleteFieldWorker";

import AdminHome from './pages/Admin/AdminHome';
import GlobalRegister from './pages/Admin/GlobalRegister';
import { register } from './serviceWorkerRegistration';
import GlobalRegisterHospital from './pages/Admin/GlobalRegisterHospital';
import GlobalRegisterSupervisor from './pages/Admin/GlobalRegisterSupervisor';
import GlobalRegisterFieldWorker from './pages/Admin/GlobalRegisterFieldWorker';
import GlobalRegisterDoctor from './pages/Admin/GlobalRegisterDoctor';
import GlobalUpdate from './pages/Admin/GlobalUpdate';
import GlobalUpdateHospital from './pages/Admin/GlobalUpdateHospital';
import GlobalUpdateSupervisor from './pages/Admin/GlobalUpdateSupervisor';
import GlobalUpdateDoctor from './pages/Admin/GlobalUpdateDoctor';
import GlobalUpdateFieldWorker from './pages/Admin/GlobalUpdateFieldWorker';



import { useState, useEffect } from 'react';
import { Network } from "@capacitor/network";

import { useStorageFillingRemarks } from './StorageHooks/useStorageFillingRemarks';
import Patient from "./pages/Doctor/Patient";
import OldFollowUp from "./pages/Doctor/OldFollowUp";
import FieldWorkersInHospital from "./pages/Supervisor/FieldWorkersInHospital";
import AssignTasks from "./pages/Supervisor/AssignTasks";
import Home from "./pages/Home"
// import Prescription from './pages/FieldWorker/Prescription';
import ViewPatientHistory from "./pages/Doctor/ViewPatientHistory";

import * as apis from "./api/Api"


setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="ion-text-center">
            <b>HEALTHCARE SERVICES</b>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path = "/" component={Home}/>

          {/*ADMIN ROUTES*/}

          <Route exact path = "/admin" component={AdminHome} />
          <Route exact path = "/admin/globalRegister" component={GlobalRegister} />
          <Route exact path = "/admin/globalRegister/globalRegisterHospital" component={GlobalRegisterHospital} />
          <Route exact path = "/admin/globalRegister/globalRegisterSupervisor" component={GlobalRegisterSupervisor} />
          <Route exact path = "/admin/globalRegister/globalRegisterDoctor" component={GlobalRegisterDoctor} />
          <Route exact path = "/admin/globalRegister/globalRegisterFieldWorker" component={GlobalRegisterFieldWorker} />
          <Route exact path = "/admin/globalUpdate" component={GlobalUpdate} />
          <Route exact path = "/admin/globalUpdate/globalUpdateHospital" component={GlobalUpdateHospital} />
          <Route exact path = "/admin/globalUpdate/globalUpdateSupervisor" component={GlobalUpdateSupervisor} />
          <Route exact path = "/admin/globalUpdate/globalUpdateDoctor" component={GlobalUpdateDoctor} />
          <Route exact path = "/admin/globalUpdate/globalUpdateFieldWorker" component={GlobalUpdateFieldWorker} />

          {/*SUPERVISOR ROUTES*/}

          <Route exact path = "/supervisors" component={Supervisor}/>
          <Route exact path = "/supervisors/register" component={Register}/>
          <Route exact path = "/supervisors/register/registerDoctor" component={RegisterDoctor}/>
          <Route exact path = "/supervisors/register/registerFieldWorker" component={RegisterFieldWorker}/>
          <Route exact path = "/supervisors/register/registerPatient" component={RegisterPatient}></Route>

          <Route exact path = "/supervisors/updatePatient" component={UpdatePatient}/>

          <Route exact path = "/supervisors/delete" component={Delete}/>
          <Route exact path = "/supervisors/delete/deleteDoctor" component={DeleteDoctor}/>
          <Route exact path = "/supervisors/delete/deleteFieldWorker" component={DeleteFieldWorker}/>

          <Route exact path ="/supervisors/fieldWorkersInHospital" component={FieldWorkersInHospital}></Route>
          <Route exact path ="/supervisors/fieldWorkersInHospital/assignTasks" component={AssignTasks}></Route>

          <Route exact path = "/supervisors/newCase" component={NewCase}/>

          {/*DOCTOR ROUTES*/}
          <Route exact path = "/doctorInHospital" component={DoctorHome}/>
          <Route exact path = "/doctorInHospital/patient" component={Patient}></Route>
          <Route exact path ="/doctorInHospital/oldFollowUp" component={OldFollowUp}></Route>
          <Route exact path = "/doctorInHospital/patient/viewHistory" component={ViewPatientHistory}></Route>


          {/*<Route exact path = "/doctors" component={DoctorHome}/>*/}
          {/*<Route exact path = "/fieldWorkers" component={FieldWorker}/>*/}
          {/*<Route exact path = "/followup" component={FollowUp}/>*/}
          {/*<Route exact path = "/fieldWorkerHome" component={FWHome}/>*/}
          {/*<Route exact path = "/fillingRemarks" component={FillingRemarks}/>*/}

{/* 
          <Route exact path = "/fieldWorkerInHospital" component={FieldWorker}/>
          <Route exact path = "/followup" component={FollowUp}/>
          <Route exact path = "/fieldWorkerHome" component={FWHome}/>
          <Route exact path = "/fillingRemarks" component={FillingRemarks}/>
          <Route exact path = "/prescription" component={Prescription}/> */}




        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App; 