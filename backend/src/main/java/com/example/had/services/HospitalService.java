package com.example.had.services;

import com.example.had.payloads.HospitalDto;

import java.util.List;

public interface HospitalService {

    HospitalDto createHospital(HospitalDto hospitalDto);
    HospitalDto updateHospital(HospitalDto hospitalDto, Integer hospitalId);
    HospitalDto getHospitalById(Integer hospitalId);
    List<HospitalDto> getAllHospitals();
    List<HospitalDto> supervisorNotAssignedHospitals();
    void deleteHospital(Integer hospitalId);
}
