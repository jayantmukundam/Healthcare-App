package com.example.had.controllers;

import com.example.had.payloads.FieldWorkerDto;
import com.example.had.services.FieldWorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fieldworkers")
@CrossOrigin(origins = "*")
public class FieldWorkerController {
    @Autowired
    FieldWorkerService fieldWorkerService;

    @PreAuthorize("hasAnyAuthority('admin')")
    @PostMapping("/")
    public ResponseEntity<FieldWorkerDto> createFieldWorker(@RequestBody FieldWorkerDto fieldWorkerDto) {
        FieldWorkerDto createFieldWorkerDto = this.fieldWorkerService.createFieldWorker(fieldWorkerDto);
        return new ResponseEntity<>(createFieldWorkerDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @PutMapping("/{fwId}")
    public ResponseEntity<FieldWorkerDto> updateFieldWorker(@RequestBody FieldWorkerDto fieldWorkerDto, @PathVariable Integer fwId) {
        FieldWorkerDto updatedFieldWorker = this.fieldWorkerService.updateFieldWorker(fieldWorkerDto,fwId);
        return ResponseEntity.ok(updatedFieldWorker);
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @DeleteMapping("/{fwId}")
    public void deleteFieldWorker(@PathVariable Integer fwId) {
        this.fieldWorkerService.deleteFieldWorker(fwId);
    }

    @GetMapping("/{fwId}")
    public ResponseEntity<FieldWorkerDto> getFieldWorker(@PathVariable Integer fwId) {
        return ResponseEntity.ok(this.fieldWorkerService.getFieldWorkerById(fwId));
    }

    @PreAuthorize("hasAnyAuthority('admin')")
    @GetMapping("/")
    public ResponseEntity<List<FieldWorkerDto>> getAllFieldWorkers() {
        return ResponseEntity.ok(this.fieldWorkerService.getAllFieldWorkers());
    }

    @GetMapping("/phoneNo/{fieldWorkerId}")
    public ResponseEntity<String> getPhoneNo(@PathVariable Integer fieldWorkerId) {
        return ResponseEntity.ok(this.fieldWorkerService.getPhoneNo(fieldWorkerId));
    }
}
