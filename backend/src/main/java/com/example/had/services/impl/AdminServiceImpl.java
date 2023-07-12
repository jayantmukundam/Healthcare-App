package com.example.had.services.impl;

import com.example.had.entities.Admin;
import com.example.had.exceptions.ResourceNotFoundException;
import com.example.had.payloads.AdminDto;
import com.example.had.services.AdminService;
import com.example.had.repositories.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String getPhoneNo(Integer adminId) {
        Admin admin = this.adminRepo.findById(adminId).orElseThrow(() -> {
            return new ResourceNotFoundException("Admin", "adminId", adminId);
        });
        String phoneNo = admin.getPhoneNo();
        return phoneNo;
    }

    @Override
    public AdminDto getAdminById(Integer adminId) {
        Admin admin = this.adminRepo.findById(adminId).orElseThrow(() -> {
            return new ResourceNotFoundException("admin", "adminId", adminId);
        });
        return this.modelMapper.map(admin, AdminDto.class);
    }
}
