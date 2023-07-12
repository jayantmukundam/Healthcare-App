package com.example.had.controllers;

import com.example.had.payloads.ApiResponse;
//import com.example.had.payloads.DoctorDto;
import com.example.had.payloads.FollowUpDto;
//import com.example.had.payloads.VisitDto;
import com.example.had.services.FollowUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followUps")
@CrossOrigin(origins = "*")
public class FollowUpController {

    @Autowired
    FollowUpService followUpService;

    // CREATE FOLLOWUP BY DOCTOR (isActive=1)
    @PreAuthorize("hasAnyAuthority('doctor')")
    @PostMapping("/")
    public ResponseEntity<FollowUpDto> createFollowUp(@RequestBody FollowUpDto followUpDto) {
        FollowUpDto followUpDto1 = this.followUpService.createFollowUp(followUpDto);
        return new ResponseEntity<>(followUpDto1, HttpStatus.CREATED);
    }

    // GET ALL FOLLOWUPS ASSIGNED TO THE FIELD WORKER WITH ID - fwInHospId
    @PreAuthorize("hasAnyAuthority('fieldWorker')")
    @GetMapping("/{fwInHospId}")
    public ResponseEntity<List<FollowUpDto>> getAllFollowUpsOfFieldWorker(@PathVariable int fwInHospId){
        return ResponseEntity.ok(this.followUpService.followUpsOfFieldWorker(fwInHospId));
    }

    // UPDATE REMARKS FILLED BY THE FIELD WORKER (UPDATE IsActive=2)
    @PreAuthorize("hasAnyAuthority('fieldWorker')")
    @PutMapping("/fieldWorker/{followUpId}")
    public ResponseEntity<ApiResponse> updateFollowUpByFieldWorker(@RequestBody FollowUpDto followUpDto, @PathVariable Integer followUpId) {
        this.followUpService.updateFollowUpByFieldWorker(followUpDto,followUpId);
        return new ResponseEntity<ApiResponse>(new ApiResponse("Review updated successfully",true), HttpStatus.OK);
    }

    // END FOLLOWUP BY DOCTOR (UPDATE isActive=0)
    @PreAuthorize("hasAnyAuthority('doctor')")
    @PutMapping("/doctor/end/{followUpId}")
    public ResponseEntity<ApiResponse> updateFollowUpByDoctor(@PathVariable Integer followUpId) {
        this.followUpService.updateFollowUpByDoctor(followUpId);
        return new ResponseEntity<ApiResponse>(new ApiResponse("Follow-up ended successfully",true), HttpStatus.OK);
    }

    // GET OLD FOLLOWUPS OF A visitId
    @PreAuthorize("hasAnyAuthority('doctor')")
    @GetMapping("/visit/{visitId}/followUpId/{followUpId}")
    public ResponseEntity<List<FollowUpDto>> getOldFollowUps(@PathVariable int visitId, @PathVariable int followUpId){
        return ResponseEntity.ok(this.followUpService.oldFollowUps(visitId,followUpId));
    }

    // GET COMPLETED FOLLOWUPS BY FIELD WORKER (isActive=2)
    @PreAuthorize("hasAnyAuthority('doctor')")
    @GetMapping("/doctor/review/{docInHospId}")
    public ResponseEntity<List<FollowUpDto>> getFollowUpsOfDoctor(@PathVariable int docInHospId){
        return ResponseEntity.ok(this.followUpService.followUpsOfDoctor(docInHospId));
    }

    // GET REMAINING FOLLOWUPS (fwInHospId=NULL)
    @PreAuthorize("hasAnyAuthority('supervisor')")
    @GetMapping("/remaining/{hospitalId}")
    public ResponseEntity<List<FollowUpDto>> getRemainingFollowUps(@PathVariable int hospitalId){
        return ResponseEntity.ok(this.followUpService.remainingFollowUps(hospitalId));
    }

    @PreAuthorize("hasAnyAuthority('supervisor')")
    @PutMapping("/{followUpId}")
    public ResponseEntity<ApiResponse> assignFieldWorkerToFollowUp(@PathVariable Integer followUpId, @RequestBody FollowUpDto followUpDto) {
        this.followUpService.assignFieldWorkerToFollowUp(followUpId,followUpDto);
        return new ResponseEntity<ApiResponse>(new ApiResponse("Follow-up updated successfully",true), HttpStatus.OK);
    }
}