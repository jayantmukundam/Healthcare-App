package com.example.had.services.impl;

import com.example.had.entities.*;
import com.example.had.exceptions.ResourceNotFoundException;
import com.example.had.payloads.FieldWorkerDto;
import com.example.had.payloads.FieldWorkerInHospitalDto;
import com.example.had.payloads.HospitalDto;
import com.example.had.payloads.SupervisorDto;
import com.example.had.repositories.*;
import com.example.had.services.SupervisorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupervisorServiceImpl implements SupervisorService {
    @Autowired
    private SupervisorRepo supervisorRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private HospitalRepo hospitalRepo;

    @Autowired
    private FieldWorkerRepo fieldWorkerRepo;

    @Autowired
    private FieldWorkerInHospitalRepo fieldWorkerInHospitalRepo;

    @Autowired
    private ActorsRepo actorsRepo;

    @Override
    public SupervisorDto createSupervisor(SupervisorDto supervisorDto) {
        Supervisor supervisor = this.modelMapper.map(supervisorDto, Supervisor.class);
        int hospitalId = supervisor.getHospital().getHospitalId();
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(() -> new ResourceNotFoundException("Hospital", "Hospital Id", hospitalId));
        supervisor.setHospital(hospital);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String currentDate = formatter.format(date);
        supervisor.setRegistrationDate(currentDate);
        supervisor.setDob(supervisorDto.getDob().substring(0, 10));
        Supervisor savedSupervisor = this.supervisorRepo.save(supervisor);
        Actors actor = new Actors(savedSupervisor.getPhoneNo(), "supervisor");
        this.actorsRepo.save(actor);
        return this.modelMapper.map(savedSupervisor, SupervisorDto.class);
    }

    @Override
    public SupervisorDto updateSupervisor(SupervisorDto supervisorDto, Integer supervisorId) {
        Supervisor supervisor = this.supervisorRepo.findById(supervisorId).orElseThrow(() -> {
            return new ResourceNotFoundException("Supervisor", "supervisorId", supervisorId);
        });
        this.actorsRepo.deleteById(supervisor.getPhoneNo());
        supervisor.setFname(supervisorDto.getFname());
        supervisor.setLname(supervisorDto.getLname());
        supervisor.setGender(supervisorDto.getGender());
        supervisor.setDob(supervisorDto.getDob());
        supervisor.setPhoneNo(supervisorDto.getPhoneNo());
        supervisor.setAddress(supervisorDto.getAddress());
        int hospitalId = supervisorDto.getHospital().getHospitalId();
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(() -> new ResourceNotFoundException("Hospital", "Hospital Id", hospitalId));
        supervisor.setHospital(hospital);
        supervisor.setRegistrationDate(supervisorDto.getRegistrationDate());
        Supervisor updatedSupervisor = this.supervisorRepo.save(supervisor);
        Actors actor = new Actors(supervisor.getPhoneNo(), "supervisor");
        this.actorsRepo.save(actor);
        return this.modelMapper.map(updatedSupervisor, SupervisorDto.class);
    }

    @Override
    public SupervisorDto getSupervisorById(Integer supervisorId) {
        Supervisor supervisor = this.supervisorRepo.findById(supervisorId).orElseThrow(() -> {
            return new ResourceNotFoundException("supervisor", "supervisorId", supervisorId);
        });
        return this.modelMapper.map(supervisor, SupervisorDto.class);
    }

    @Override
    public List<SupervisorDto> getAllSupervisors() {
        List<Supervisor> supervisors = this.supervisorRepo.findAll();
        List<SupervisorDto> supervisorDtos = supervisors.stream().map(supervisor -> this.modelMapper.map(supervisor, SupervisorDto.class)).collect(Collectors.toList());
        return supervisorDtos;
    }

    @Override
    public void deleteSupervisor(Integer supervisorId) {
        Supervisor supervisor = this.supervisorRepo.findById(supervisorId).orElseThrow(() -> {
            return new ResourceNotFoundException("supervisor", "supervisorId", supervisorId);
        });
        this.supervisorRepo.delete(supervisor);
    }

    @Override
    public String getPhoneNo(Integer sId) {
        Supervisor supervisor = this.supervisorRepo.findById(sId).orElseThrow(() -> {
            return new ResourceNotFoundException("Supervisor", "supervisortId", sId);
        });
        String phoneNo = supervisor.getPhoneNo();
        return phoneNo;
    }

}







//    @Override
//    public void registerFieldWorker(Integer fwId  , Integer hosId)
//    {
//        FieldWorkerInHospital  fieldWorkerInHospital=new FieldWorkerInHospital();
//        FieldWorker fieldWorker = this.fieldWorkerRepo.findById(fwId).orElseThrow(()->new ResourceNotFoundException("FieldWorker","fieldworker id",fwId));;
//        Hospital hospital = this.hospitalRepo.findById(hosId).orElseThrow(()->new ResourceNotFoundException("Hospital","hospital",hosId));;
//        fieldWorkerInHospital.setFieldWorker(fieldWorker);
//        fieldWorkerInHospital.setHospital(hospital);
//        Date date = new Date();
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//        fieldWorkerInHospital.setRegistrationDate(formatter.format(date));
//        FieldWorkerInHospital fieldWorkerInHospital1 = this.fieldWorkerInHospitalRepo.save(fieldWorkerInHospital);
//
//    }
//    @Override
//    public List<FieldWorkerDto> getFieldWorker(int hospitalId) {
//
//        FieldWorkerInHospital fieldWorkerInHospital= this.fieldWorkerInHospitalRepo.findById(hospitalId).orElseThrow(() -> {
//            return new ResourceNotFoundException("hospital", "hospitalId", hospitalId); });
//        FieldWorker fieldWorker=fieldWorkerInHospital.getFieldWorker();
//
//        List<FieldWorkerDto> fieldWorkerDtos = fieldWorker.stream().map(hospital -> this.modelMapper.map(fieldWorker, FieldWorkerDto.class)).collect(Collectors.toList());
//        return fieldWorkerDtos;
//       }




