package com.example.had.controllers;

//import com.example.had.payloads.ApiResponse;
//import com.example.had.payloads.DoctorDto;
import com.example.had.payloads.PatientDto;
import com.example.had.repositories.ActorsRepo;
import com.example.had.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @Autowired
    private ActorsRepo actorsRepo;

    //PATIENT REGISTER:
    @PreAuthorize("hasAnyAuthority('supervisor')")
    @PostMapping("/")
    public ResponseEntity<PatientDto> createPatient(@RequestBody PatientDto patientDto) {
        PatientDto patientDto1 = this.patientService.createPatient(patientDto);
        return new ResponseEntity<>(patientDto1, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyAuthority('supervisor', 'doctor')")
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDto> searchingPatient(@PathVariable int patientId){
        return ResponseEntity.ok(this.patientService.searchPatient(patientId));
    }

    @GetMapping("/phoneNo/{patientId}")
    public ResponseEntity<String> getPhoneNo(@PathVariable Integer patientId) {
        return ResponseEntity.ok(this.patientService.getPhoneNo(patientId));
    }
    @PreAuthorize("hasAnyAuthority('supervisor')")
    @PutMapping("/{patientId}")
    public ResponseEntity<PatientDto> updatePatient(@RequestBody PatientDto patientDto, @PathVariable Integer patientId) {
        PatientDto updatedPatient = this.patientService.updatePatient(patientDto, patientId);
        return ResponseEntity.ok(updatedPatient);
    }
}
