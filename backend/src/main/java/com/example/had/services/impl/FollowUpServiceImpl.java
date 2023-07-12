package com.example.had.services.impl;

import com.example.had.entities.*;
import com.example.had.exceptions.ResourceNotFoundException;
import com.example.had.payloads.FollowUpDto;
import com.example.had.payloads.PatientDto;
import com.example.had.payloads.VisitDto;
import com.example.had.repositories.*;
import com.example.had.services.FollowUpService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowUpServiceImpl implements FollowUpService {



    @Autowired
    private FollowUpRepo followUpRepo;

    @Autowired
    private VisitRepo visitRepo;

    @Autowired
    private FieldWorkerInHospitalRepo fieldWorkerInHospitalRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private HospitalRepo hospitalRepo;

    @Autowired
    private DoctorInHospitalRepo doctorInHospitalRepo;


    @Override
    public FollowUpDto createFollowUp(FollowUpDto followUpDto) {
        int visitId = followUpDto.getVisit().getVisitId();
        int fwInHospId = followUpDto.getFieldWorkerInHospital().getFwInHospId();
        System.out.println(fwInHospId);

        Visit visit = this.visitRepo.findById(visitId).orElseThrow(()->new ResourceNotFoundException("Visit","visit id",visitId));
//        System.out.println(followUpDto.getFieldWorkerInHospital().getFwInHospId());
        if(fwInHospId!=-1){
            FieldWorkerInHospital fieldWorkerInHospital = this.fieldWorkerInHospitalRepo.findById(fwInHospId).orElseThrow(()->new ResourceNotFoundException("FieldWorkerInHospital","fwInHosp id",fwInHospId));
            followUpDto.setFieldWorkerInHospital(fieldWorkerInHospital);
        }
        else{
            followUpDto.setFieldWorkerInHospital(null);
        }

        followUpDto.setVisit(visit);
        followUpDto.setReviewByFieldWorker("none");
        if(followUpDto.getVerificationNumber()==null || followUpDto.getVerificationNumber().length()==0)
            followUpDto.setVerificationNumber("none");
        FollowUp followUp = this.modelMapper.map(followUpDto, FollowUp.class);
        FollowUp savedFollowUp = this.followUpRepo.save(followUp);
        return this.modelMapper.map(savedFollowUp, FollowUpDto.class);

    }

    @Override
    public List<FollowUpDto> followUpsOfFieldWorker(int fwInHospId) {
        FieldWorkerInHospital fieldWorkerInHospital = this.fieldWorkerInHospitalRepo.findById(fwInHospId).orElseThrow(()->new ResourceNotFoundException("FieldWorkerInHospital","fwInHospId",fwInHospId));
        List<FollowUp> followUps = this.followUpRepo.findAllByIsActiveAndFieldWorkerInHospital(1,fieldWorkerInHospital);
        List<FollowUpDto> followUpDtos = followUps.stream().map((followUp -> this.modelMapper.map(followUp, FollowUpDto.class))).collect(Collectors.toList());
        return followUpDtos;
    }

    @Override
    public void updateFollowUpByFieldWorker(FollowUpDto followUpDto, int followUpId) {
        FollowUp followUp = this.followUpRepo.findById(followUpId).orElseThrow(()-> new ResourceNotFoundException("FollowUp","followUpId",followUpId));
        int fwInHospId = followUp.getFieldWorkerInHospital().getFwInHospId();
        FieldWorkerInHospital fieldWorkerInHospital = this.fieldWorkerInHospitalRepo.findById(fwInHospId).orElseThrow(()-> new ResourceNotFoundException("FollowUp","followUpId",followUpId));
        int currNumOfTasksAssignedPerDay = fieldWorkerInHospital.getNumOfTasksAssignedPerDay();
        currNumOfTasksAssignedPerDay--;
        fieldWorkerInHospital.setNumOfTasksAssignedPerDay(currNumOfTasksAssignedPerDay);
        this.fieldWorkerInHospitalRepo.save(fieldWorkerInHospital);
        followUp.setReviewByFieldWorker(followUpDto.getReviewByFieldWorker());
        followUp.setIsActive(2);
        this.followUpRepo.save(followUp);
    }
//
    @Override
    public void updateFollowUpByDoctor(int followUpId) {
        FollowUp followUp = this.followUpRepo.findById(followUpId).orElseThrow(()-> new ResourceNotFoundException("FollowUp","followUpId",followUpId));
        followUp.setIsActive(0);
        this.followUpRepo.save(followUp);
    }

    @Override
    public List<FollowUpDto> oldFollowUps(int visitId, int followUpId) {
//        Visit visit = this.visitRepo.findById(visitId).orElseThrow(()->new ResourceNotFoundException("Visit","visit id",visitId));
        List<FollowUp> followUps = this.followUpRepo.findAllByIdAndVisit(followUpId,visitId);
        List<FollowUpDto> followUpDtos = followUps.stream().map((followUp -> this.modelMapper.map(followUp, FollowUpDto.class))).collect(Collectors.toList());
        return followUpDtos;

    }

    @Override
    public List<FollowUpDto> followUpsOfDoctor(int docInHospId) {
        List<FollowUp> followUps = this.followUpRepo.findAllByVisits(docInHospId);
        List<FollowUpDto> followUpDtos = followUps.stream().map((followUp -> this.modelMapper.map(followUp, FollowUpDto.class))).collect(Collectors.toList());
        return followUpDtos;

    }

    @Override
    public List<FollowUpDto> remainingFollowUps(int hospitalId) {

        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//        visit.setVisitDate(formatter.format(date));
        List<FollowUp> followUps = this.followUpRepo.findRemainingFollowUps(hospitalId,formatter.format(date));
        List<FollowUpDto> followUpDtos = followUps.stream().map((followUp -> this.modelMapper.map(followUp, FollowUpDto.class))).collect(Collectors.toList());
        return followUpDtos;

    }

    @Override
    public void assignFieldWorkerToFollowUp(int followUpId, FollowUpDto followUpDto) {
        FollowUp followUp = this.followUpRepo.findById(followUpId).orElseThrow(()-> new ResourceNotFoundException("FollowUp","followUpId",followUpId));
        int fwInHospId = followUpDto.getFieldWorkerInHospital().getFwInHospId();

        FieldWorkerInHospital fieldWorkerInHospital = this.fieldWorkerInHospitalRepo.findById(fwInHospId).orElseThrow(()->new ResourceNotFoundException("FieldWorkerInHospital","fwInHospId",fwInHospId));
        followUp.setFieldWorkerInHospital(fieldWorkerInHospital);
        followUp.setVerificationNumber(followUpDto.getVerificationNumber());
        this.followUpRepo.save(followUp);
    }

}
