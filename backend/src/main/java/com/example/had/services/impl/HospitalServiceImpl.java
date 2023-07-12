package com.example.had.services.impl;

import com.example.had.entities.Hospital;
import com.example.had.exceptions.ResourceNotFoundException;
import com.example.had.payloads.HospitalDto;
import com.example.had.repositories.HospitalRepo;
import com.example.had.services.HospitalService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {
    @Autowired
    private HospitalRepo hospitalRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public HospitalDto createHospital(HospitalDto hospitalDto) {
        Hospital hospital = this.modelMapper.map(hospitalDto, Hospital.class);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String currentDate = formatter.format(date);
        hospital.setRegistrationDate(currentDate);
        Hospital savedHospital = this.hospitalRepo.save(hospital);
        return this.modelMapper.map(savedHospital, HospitalDto.class);
    }

    @Override
    public HospitalDto updateHospital(HospitalDto hospitalDto, Integer hospitalId) {
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(() -> {
            return new ResourceNotFoundException("Hospital", "hospitalId", hospitalId);
        });
        hospital.setName(hospitalDto.getName());
        hospital.setAddress(hospitalDto.getAddress());
        hospital.setRegistrationDate(hospitalDto.getRegistrationDate());
        Hospital updatedHospital = this.hospitalRepo.save(hospital);
        return this.modelMapper.map(updatedHospital, HospitalDto.class);
    }

    @Override
    public HospitalDto getHospitalById(Integer hospitalId) {
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(() -> {
            return new ResourceNotFoundException("hospital", "hospitalId", hospitalId);
        });
        return this.modelMapper.map(hospital, HospitalDto.class);
    }

    @Override
    public List<HospitalDto> getAllHospitals() {
        List<Hospital> hospitals = this.hospitalRepo.findAll();
        List<HospitalDto> hospitalDtos = hospitals.stream().map(hospital -> this.modelMapper.map(hospital, HospitalDto.class)).collect(Collectors.toList());
        return hospitalDtos;
    }

    @Override
    public void deleteHospital(Integer hospitalId) {
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(() -> {
            return new ResourceNotFoundException("hospital", "hospitalId", hospitalId);
        });
        this.hospitalRepo.delete(hospital);

    }

    @Override
    public List<HospitalDto> supervisorNotAssignedHospitals() {
        List<Hospital> hospitals = this.hospitalRepo.findSupervisorNotAssignedHospitals();
        List<HospitalDto> hospitalDtos = hospitals.stream().map(hospital -> this.modelMapper.map(hospital, HospitalDto.class)).collect(Collectors.toList());
        return hospitalDtos;
    }
}
