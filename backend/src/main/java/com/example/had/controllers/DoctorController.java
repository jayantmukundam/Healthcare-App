package com.example.had.controllers;

import com.example.had.payloads.DoctorDto;
//import com.example.had.payloads.HospitalDto;
import com.example.had.services.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {
    @Autowired
    DoctorService doctorService;

    @PreAuthorize("hasAnyAuthority('admin')")
    @PostMapping("/")
    public ResponseEntity<DoctorDto> createDoctor(@RequestBody DoctorDto doctorDto) {
        DoctorDto createDoctorDto = this.doctorService.createDoctor(doctorDto);
        return new ResponseEntity<>(createDoctorDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @PutMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> updateDoctor(@RequestBody DoctorDto doctorDto, @PathVariable Integer doctorId) {
        DoctorDto updatedDoctor = this.doctorService.updateDoctor(doctorDto,doctorId);
        return ResponseEntity.ok(updatedDoctor);
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @DeleteMapping("/{doctorId}")
    public void deleteDoctor(@PathVariable Integer doctorId) {
        this.doctorService.deleteDoctor(doctorId);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> getDoctor(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(this.doctorService.getDoctorById(doctorId));
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @GetMapping("/")
    public ResponseEntity<List<DoctorDto>> getAllDoctors() {
        return ResponseEntity.ok(this.doctorService.getAllDoctors());
    }

    @GetMapping("/phoneNo/{doctorId}")
    public ResponseEntity<String> getPhoneNo(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(this.doctorService.getPhoneNo(doctorId));
    }
}
