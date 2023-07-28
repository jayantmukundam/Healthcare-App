# Healthcare-App
### [Demonstration Link](https://drive.google.com/file/d/14PwKD18-JDBGzwqPQ55_ScTsB_fpO2mS/view?usp=sharing)
This platform extends healtcare services from hospitals to home.
There are 4 users of this app.
- Admin
- Supervisor
- Doctor
- Field worker
## Roles
Below mentioned are the users and their key roles:
### 1) Admin
   - Register doctors, field workers and supervisor in the app.
   - Assign hospital to supervisors.
   
### 2) Supervisor
   * Register doctors & field workers in their hospital.
   * Register a new patient in the app & handover their health ID to them. This health ID will be used to refer that patient in the        future.
   * Take patient's consent so that the doctors can view their previous health records if needed.
   * Assign follow-ups to a field worker.
   
### 3) Doctor
   - Diagonize the patient and add syptoms, prescription and follow-ups if required.
   - Review the follow-up remarks taken by the field worker. They can assign a new follow-up after reviewing or end the case.
   
### 4) Field worker
   - Fill up remarks to the assigned follow-ups by visiting a patient.
   - Print the prescription and handover it to the patient if they ask.

## Key functionalities
 1. Once the supervisor creates a new case of a patient, the patient will be auto-assigned to a doctor which have minimum active cases at that moment.
 2. Health records are private data of a patient. Thus, the supervisor takes consent of the patient using OTP so that the doctors can refer them if required.
 3. **Offline mode** : The application that the field workers are using supports offline mode. Thus, the app will function even if the field worker has no/poor network connectivity.
     This functionality assissts them when they visit any remote area having low network connectivity.
 4. There is a mechanism implemented which can check if the field worker has actually visited the patient.  
 
