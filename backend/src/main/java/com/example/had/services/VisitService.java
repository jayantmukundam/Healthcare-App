package com.example.had.services;

import com.example.had.payloads.FollowUpDto;
import com.example.had.payloads.VisitDto;

import java.util.List;

public interface VisitService {
    void createVisit(VisitDto visitDto);
    List<VisitDto> activeVisits(int hospitalId, int docInHosptId);
  void deactivateVisits(Integer visitId);
  VisitDto updateVisit(VisitDto visitDto, Integer visitId);

    List<VisitDto>  oldVisits(int visitId, int patientId);

}
