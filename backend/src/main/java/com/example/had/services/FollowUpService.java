package com.example.had.services;

import com.example.had.payloads.FollowUpDto;

import java.util.List;

public interface FollowUpService {
    FollowUpDto createFollowUp(FollowUpDto followUpDto);

    List<FollowUpDto> followUpsOfFieldWorker(int fwInHospId);
    void updateFollowUpByFieldWorker(FollowUpDto followUpDto, int followUpId);


    void updateFollowUpByDoctor(int followUpId);

    List<FollowUpDto>  oldFollowUps(int visitId,int followUpId);

    List<FollowUpDto> followUpsOfDoctor(int docInHospId);

    List<FollowUpDto> remainingFollowUps(int hospitalId);

    void assignFieldWorkerToFollowUp(int followUpId, FollowUpDto followUpDto);

}
