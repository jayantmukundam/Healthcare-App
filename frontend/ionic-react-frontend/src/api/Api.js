const ip = "192.168.43.109";

const base = `http://${ip}:9090/api`;

//base:
export const API_BASE = base;

//otp:
export const API_OTP_GEN = `${base}/phoneNumber/generateOTP`;
export const API_OTP_VERIFY = `${base}/phoneNumber/verifyOTP`;
export const API_SEND_SMS = `${base}/phoneNumber/sendSMS`;


// otp with jwt:
    export const JWT_REQ_OTP = `${base}/client/auth/requestOtp`;
    export const JWT_VERIFY_OTP = `${base}/client/auth/verifyOtp`;


//followups:
const followups = `${base}/followUps`

export const API_FOLLOWUPS = `${followups}`
//update reviews:
export const API_REVIEW_UPD =`${followups}/fieldWorker`;

//doctor ending followup:
export const API_FOLLOWUP_DOC_END = `${API_FOLLOWUPS}/doctor/end`

//doctor reviewing followups:
export const API_FOLLOWUP_DOC_REV = `${API_FOLLOWUPS}/doctor/review`


//visit:
export const API_FOLLOWUP_VIS = `${API_FOLLOWUPS}/visit`

//doctors:
const doctor = `${base}/doctors`;
//register doctor:
export const API_DOC_REG = `${doctor}`

//patients:
const patient = `${base}/patients`;
//register fieldWorker:
export const API_PATIENT = `${patient}`

//fieldWorkers:
const fw = `${base}/fieldworkers`;
//register fieldWorker:
export const API_FW_REG = `${fw}`

//fieldWorkerInHospital:
const fwInHosp = `${base}/fieldWorkerInHospital`
//register:
export const API_FWINHOSP_REG = `${fwInHosp}`
export const API_FWINHOSP_DEL = `${API_FWINHOSP_REG}/del`


//doctorInHospital:
const doctorInHosp = `${base}/doctorInHospital`
//register:
export const API_DOCINHOSP_REG = `${doctorInHosp}`
export const API_DOCINHOSP_DEL = `${API_DOCINHOSP_REG}/del`
export const API_GET_ALL_DOCINHOSP = `${doctorInHosp}/getAllDocInHosp`

//hostpitals:
const hospital = `${base}/hospitals`;
//register hospital:
export const API_HOSP_REG = `${hospital}`
// fetching hospital with no supervisor assigned
export const API_HOSP_NOSUP = `${hospital}/noSupervisor`

//supervisors:
const sup = `${base}/supervisors`;
//register supervisors:
export const API_SUP_REG = `${sup}`

// *****************************************************************************************

// visits:
const visit = `${base}/visits`;
export const API_VIS = `${visit}`
//active visits corresponding to an hospital:
export const API_ACTIVE_VIS = `${API_VIS}/activeVisits/hospital`
//visited:
export const API_VISITED = `${API_VIS}/visited`
