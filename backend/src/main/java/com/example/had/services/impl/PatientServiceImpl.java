package com.example.had.services.impl;


import com.example.had.entities.Doctor;
import com.example.had.entities.Patient;
import com.example.had.entities.Hospital;
import com.example.had.entities.Patient;
import com.example.had.entities.Supervisor;
import com.example.had.exceptions.ResourceNotFoundException;
import com.example.had.payloads.PatientDto;
import com.example.had.repositories.HospitalRepo;
import com.example.had.repositories.PatientRepo;
import com.example.had.repositories.SupervisorRepo;
import com.example.had.services.PatientService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class PatientServiceImpl implements PatientService {
    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private HospitalRepo hospitalRepo;

    @Autowired
    private SupervisorRepo supervisorRepo;

    @Autowired
    private ModelMapper modelMapper;

//    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);

    @Override
    public PatientDto createPatient(PatientDto patientDto) {
        Patient patient = this.modelMapper.map(patientDto, Patient.class);
        int hospitalId = patient.getHospital().getHospitalId();
        int supervisorId = patient.getSupervisor().getSupervisorId();

//        String phNo = patient.getPhoneNo();
//        String encryptPhNo = encoder.encode(phNo);
//        patient.setPhoneNo(encryptPhNo);

        //find hospital by hospitalId: using repo

        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(()->new ResourceNotFoundException("Hospital", "hospital id", hospitalId));
        Supervisor supervisor = this.supervisorRepo.findById(supervisorId).orElseThrow(()->new ResourceNotFoundException("Supervisor","supervisor id", supervisorId));

        patient.setHospital(hospital);
        patient.setSupervisor(supervisor);

        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        patient.setRegistrationDate(formatter.format(date));

        Patient savedPatient = this.patientRepo.save(patient);
        return this.modelMapper.map(savedPatient, PatientDto.class);
    }
    @Override
    public String getPhoneNo(Integer pId)
    {
       Patient patient= this.patientRepo.findById(pId).orElseThrow(() -> {
            return new ResourceNotFoundException("patient", "patientId", pId); });
        String phoneNo=patient.getPhoneNo();
        return phoneNo;
    }

    public PatientDto searchPatient(int patientId){
        Patient patientFound = this.patientRepo.findById(patientId).orElseThrow(()->new ResourceNotFoundException("Patient", "Patient ID", patientId));
        return this.modelMapper.map(patientFound, PatientDto.class);
    }

    public PatientDto updatePatient(PatientDto patientDto, Integer patientId) {
        Patient patient = this.patientRepo.findById(patientId).orElseThrow(()->new ResourceNotFoundException("Patient", "Patient ID", patientId));
        patient.setFname(patientDto.getFname());
        patient.setLname(patientDto.getLname());
        patient.setAddress(patientDto.getAddress());
        patient.setGender(patientDto.getGender());
        patient.setPhoneNo(patientDto.getPhoneNo());
        patient.setDob(patientDto.getDob());
        patient.setHospital(patientDto.getHospital());
        patient.setSupervisor(patientDto.getSupervisor());
        Patient updatedPatient = this.patientRepo.save(patient);
        return this.modelMapper.map(updatedPatient, PatientDto.class);
    }
}
