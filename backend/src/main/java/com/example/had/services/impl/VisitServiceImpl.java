package com.example.had.services.impl;

import com.example.had.entities.*;
import com.example.had.exceptions.ResourceNotFoundException;
import com.example.had.payloads.FollowUpDto;
import com.example.had.payloads.HospitalDto;
import com.example.had.payloads.VisitDto;
import com.example.had.repositories.*;
import com.example.had.services.VisitService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VisitServiceImpl implements VisitService {
    @Autowired
    VisitRepo visitRepo;

    @Autowired
    HospitalRepo hospitalRepo;

    @Autowired
    PatientRepo patientRepo;

    @Autowired
    DoctorInHospitalRepo doctorInHospitalRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void createVisit(VisitDto visitDto) {
        Visit visit  = this.modelMapper.map(visitDto, Visit.class);
        int hospitalId = visit.getHospital().getHospitalId();
        int patientId = visit.getPatient().getPatientId();
        int docInHospId = visit.getDoctorInHospital().getDocInHospId();
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(()->new ResourceNotFoundException("Hospital","hospital id",hospitalId));
        Patient patient = this.patientRepo.findById(patientId).orElseThrow(()->new ResourceNotFoundException("Patient","patient id",patientId));
        DoctorInHospital doctorInHospital = this.doctorInHospitalRepo.findById(docInHospId).orElseThrow(()->new ResourceNotFoundException("DoctorInHospital", "DocInHosp Id", docInHospId));
        visit.setIsActive(1);
        visit.setHospital(hospital);

//        updatePatient.setPatientId();
        visit.setPatient(patient);
        visit.setDoctorInHospital(doctorInHospital);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        visit.setVisitDate(formatter.format(date));
        visit.setSymptoms("none");
        visit.setPrescription("none");
        Visit addedVisit = this.visitRepo.save(visit);
    }

    @Override
    public List<VisitDto> activeVisits(int hospitalId, int docInHospId) {
//        List<Visit> activeVisits = this.visitRepo.findActiveVisits(hospitalId);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String currentDate = formatter.format(date);
        System.out.println(currentDate);
        Hospital hospital = this.hospitalRepo.findById(hospitalId).orElseThrow(()->new ResourceNotFoundException("Hospital","hospital id",hospitalId));
        DoctorInHospital doctorInHospital = this.doctorInHospitalRepo.findById(docInHospId).orElseThrow(()->new ResourceNotFoundException("DoctorInHospital", "DocInHosp Id", docInHospId));

        List<Visit> activeVisits = this.visitRepo.findAllByIsActiveAndVisitDateAndHospitalAndDoctorInHospital(1,currentDate,hospital,doctorInHospital);
        List<VisitDto> activeVisitsDtos = activeVisits.stream().map((activeVisit -> this.modelMapper.map(activeVisit, VisitDto.class))).collect(Collectors.toList());
        return activeVisitsDtos;
    }

    @Override
   public void deactivateVisits(Integer visitId)
    {
        Visit visit=this.visitRepo.findById(visitId).orElseThrow(() -> new ResourceNotFoundException("Visit","Id",visitId));
        visit.setIsActive(0);

        this.visitRepo.save(visit);
    }

    @Override
    public VisitDto updateVisit(VisitDto visitDto, Integer visitId) {
        Visit visit = this.visitRepo.findById(visitId).orElseThrow(()->new ResourceNotFoundException("Visit", "Visit Id", visitId));
        int docInHospId = visitDto.getDoctorInHospital().getDocInHospId();
//        DoctorInHospital doctorInHospital = this.doctorInHospitalRepo.findById(docInHospId).orElseThrow(()->new ResourceNotFoundException("DoctorInHospital", "DocInHosp Id", docInHospId));
        visit.setPrescription(visitDto.getPrescription());
        visit.setSymptoms(visitDto.getSymptoms());
        visit.setIsActive(0);
//        visit.setDoctorInHospital(doctorInHospital);
        Visit updatedVisit = visitRepo.save(visit);
        return this.modelMapper.map(updatedVisit, VisitDto.class);
    }

    @Override
    public List<VisitDto> oldVisits(int visitId, int patientId) {
//        Visit visit = this.visitRepo.findById(visitId).orElseThrow(()->new ResourceNotFoundException("Visit","visit id",visitId));
        List<Visit> visits = this.visitRepo.findAllByIdAndPatient(visitId,patientId);
        List<VisitDto> VisitDtos = visits.stream().map((visit -> this.modelMapper.map(visit, VisitDto.class))).collect(Collectors.toList());
        return VisitDtos;

    }
}
