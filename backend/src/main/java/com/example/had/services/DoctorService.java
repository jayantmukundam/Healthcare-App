package com.example.had.services;

import com.example.had.payloads.DoctorDto;
import com.example.had.payloads.SupervisorDto;

import java.util.List;

public interface DoctorService {
    DoctorDto createDoctor(DoctorDto doctorDto);
    DoctorDto updateDoctor(DoctorDto doctorDto, Integer doctorID);
    DoctorDto getDoctorById(Integer doctorId);
    List<DoctorDto> getAllDoctors();
    void deleteDoctor(Integer doctorId);
   String getPhoneNo(Integer dId);

}
