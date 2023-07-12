package com.example.had.controllers;

import com.example.had.payloads.ApiResponse;
import com.example.had.payloads.DoctorInHospitalDto;
import com.example.had.services.DoctorInHospitalService;
import com.example.had.services.DoctorService;
import com.example.had.payloads.FieldWorkerInHospitalDto;
import com.example.had.services.DoctorInHospitalService;
import com.example.had.services.DoctorService;
import com.example.had.services.FieldWorkerInHospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctorInHospital")
@CrossOrigin(origins = "*")
public class DoctorInHospitalController {

    @Autowired
    DoctorInHospitalService doctorInHospitalService;
    @Autowired
    DoctorService doctorService;

    @PreAuthorize("hasAnyAuthority('supervisor')")
    @PutMapping("/{docInHospId}")
    public ResponseEntity<DoctorInHospitalDto> updateDoctorInHospital(@RequestBody DoctorInHospitalDto doctorInHospitalDto, @PathVariable Integer docInHospId) {
        DoctorInHospitalDto updatedDoctorInHospital = this.doctorInHospitalService.updateDoctorInHospital(doctorInHospitalDto,docInHospId);
        return ResponseEntity.ok(updatedDoctorInHospital );
    }


    @GetMapping("/{docInHospId}")
    public ResponseEntity<DoctorInHospitalDto>getDoctorInHospitalById(@PathVariable Integer docInHospId) {
        return ResponseEntity.ok(this.doctorInHospitalService.getDoctorInHospitalById(docInHospId));
    }


    @PreAuthorize("hasAnyAuthority('supervisor')")
    @PostMapping("/docInHosp/{docInHospId}/hospital/{hospitalId}")
    //public registerFieldWorker(@PathVariable Integer fwInHosp,@PathVariable Integer hospitalId) ;
    public ResponseEntity<ApiResponse>  registerDoctor(@PathVariable Integer docInHospId, @PathVariable Integer hospitalId){
        this.doctorInHospitalService.registerDoctor(docInHospId,hospitalId);
        return new ResponseEntity<ApiResponse>(new ApiResponse("Doctor registered successfully",true), HttpStatus.OK);
    }

    @GetMapping("/phoneNo/{docInHospId}")
    public ResponseEntity<String> getPhoneNo(@PathVariable Integer docInHospId) {
        return ResponseEntity.ok(this.doctorInHospitalService.getPhoneNo(docInHospId));
    }

    @PreAuthorize("hasAnyAuthority('supervisor')")
    @DeleteMapping("/del/{doctorInHospId}")
    public void deleteDoctor(@PathVariable("doctorInHospId") Integer doctorInHospId) {
        this.doctorInHospitalService.deleteDoctor(doctorInHospId);
    }
    @PreAuthorize("hasAnyAuthority('supervisor')")
    @GetMapping("/getAllDocInHosp/{hospitalId}")
    public List<DoctorInHospitalDto> getAllDoctorsOfHospital(@PathVariable("hospitalId") Integer hospitalId){
        return this.doctorInHospitalService.getAllDoctorsOfHospital(hospitalId);
    }


}
