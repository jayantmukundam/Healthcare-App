package com.example.had.controllers;

import com.example.had.payloads.HospitalDto;
import com.example.had.services.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {
    @Autowired
    private HospitalService hospitalService;

    @PreAuthorize("hasAnyAuthority('admin')")
    @PostMapping("/")
    public ResponseEntity<HospitalDto> createHospital(@RequestBody HospitalDto hospitalDto) {
        HospitalDto createHospitalDto = this.hospitalService.createHospital(hospitalDto);
        return new ResponseEntity<>(createHospitalDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @PutMapping("/{hospitalId}")
    public ResponseEntity<HospitalDto> updateHospital(@RequestBody HospitalDto hospitalDto, @PathVariable Integer hospitalId) {
        HospitalDto updatedHospital = this.hospitalService.updateHospital(hospitalDto,hospitalId);
        return ResponseEntity.ok(updatedHospital);
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @DeleteMapping("/{hospitalId}")
    public void deleteHospital(@PathVariable Integer hospitalId) {
        this.hospitalService.deleteHospital(hospitalId);
    }
    

    @GetMapping("/{hospitalId}")
    public ResponseEntity<HospitalDto> getHospital(@PathVariable Integer hospitalId) {
        return ResponseEntity.ok(this.hospitalService.getHospitalById(hospitalId));
    }



    @PreAuthorize("hasAnyAuthority('admin')")
    @GetMapping("/noSupervisor")
    public ResponseEntity<List<HospitalDto>> supervisorNotAssignedHospitals() {
        return ResponseEntity.ok(this.hospitalService.supervisorNotAssignedHospitals());
    }

}
