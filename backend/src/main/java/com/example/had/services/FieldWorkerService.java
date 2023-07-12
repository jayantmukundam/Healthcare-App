package com.example.had.services;

import com.example.had.payloads.FieldWorkerDto;

import java.util.List;

public interface FieldWorkerService {
    FieldWorkerDto createFieldWorker(FieldWorkerDto fieldWorkerDto);
    FieldWorkerDto updateFieldWorker(FieldWorkerDto fieldWorkerDto, Integer fwID);
    FieldWorkerDto getFieldWorkerById(Integer fwId);
    List<FieldWorkerDto> getAllFieldWorkers();
    void deleteFieldWorker(Integer fwId);
    String getPhoneNo(Integer fId);
}
