package com.example.had.controllers;

import com.example.had.payloads.ApiResponse;
//import com.example.had.payloads.HospitalDto;
import com.example.had.payloads.FollowUpDto;
import com.example.had.payloads.VisitDto;
import com.example.had.services.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "*")
public class VisitController {
    @Autowired
    private VisitService visitService;

    // POST - create visit
    @PreAuthorize("hasAnyAuthority('supervisor')")
    @PostMapping("/")
    public ResponseEntity<ApiResponse> createVisit(@RequestBody VisitDto visitDto){
//        System.out.println(visitDto.);
        this.visitService.createVisit(visitDto);
        return new ResponseEntity<ApiResponse>(new ApiResponse("Visit created successfully",true), HttpStatus.OK);
    }
    @PreAuthorize("hasAnyAuthority('doctor', 'supervisor')")
    @GetMapping("/activeVisits/hospital/{hospitalId}/docInHosp/{docInHospId}")
    public ResponseEntity<List<VisitDto>> getActiveVisits(@PathVariable int hospitalId, @PathVariable int docInHospId){
        return ResponseEntity.ok(this.visitService.activeVisits(hospitalId,docInHospId));
    }

    @PreAuthorize("hasAnyAuthority('doctor')")
    @PutMapping("/{visitId}")
    public ResponseEntity<ApiResponse> deactivateVisits(@PathVariable Integer visitId) {
       this.visitService.deactivateVisits(visitId);
        return new ResponseEntity<ApiResponse>(new ApiResponse("Visit deactivated successfully", true), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('doctor')")
    @PutMapping("/visited/{visitId}")
    public ResponseEntity<VisitDto> updateVisit(@RequestBody VisitDto visitDto, @PathVariable Integer visitId) {
        VisitDto updatedVisit = this.visitService.updateVisit(visitDto, visitId);
        return ResponseEntity.ok(updatedVisit);
    }

    // GET OLD VISITS OF A PATIENT
    @PreAuthorize("hasAnyAuthority('doctor')")
    @GetMapping("/{visitId}/patient/{patientId}")
    public ResponseEntity<List<VisitDto>> getOldFollowUps(@PathVariable int visitId, @PathVariable int patientId){
        return ResponseEntity.ok(this.visitService.oldVisits(visitId,patientId));
    }
}
