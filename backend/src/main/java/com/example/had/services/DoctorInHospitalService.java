package com.example.had.services;

import com.example.had.payloads.DoctorInHospitalDto;
import com.example.had.payloads.FieldWorkerInHospitalDto;
//import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface DoctorInHospitalService {

    DoctorInHospitalDto updateDoctorInHospital(DoctorInHospitalDto doctorInHospitalDto, Integer docInHospId);
    DoctorInHospitalDto getDoctorInHospitalById(Integer docInHospId);

    void registerDoctor(Integer docId, Integer hosId);
    void deleteDoctor(Integer docInHospId);
    String getPhoneNo(Integer docInHospId);

    List<DoctorInHospitalDto> getAllDoctorsOfHospital(Integer hospitalId);


}

