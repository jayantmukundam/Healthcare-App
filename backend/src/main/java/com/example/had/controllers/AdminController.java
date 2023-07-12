package com.example.had.controllers;

import com.example.had.payloads.AdminDto;
import com.example.had.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    AdminService adminService;

    @GetMapping("/{adminId}")
    public ResponseEntity<AdminDto> getAdminById(@PathVariable Integer adminId) {
        return ResponseEntity.ok(this.adminService.getAdminById(adminId));
    }

    @GetMapping("/phoneNo/{adminId}")
    public ResponseEntity<String> getPhoneNo(@PathVariable Integer adminId) {
        return ResponseEntity.ok(this.adminService.getPhoneNo(adminId));
    }
}
