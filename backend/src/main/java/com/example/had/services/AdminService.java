package com.example.had.services;

import com.example.had.payloads.AdminDto;

public interface AdminService {
    String getPhoneNo(Integer adminId);

    AdminDto getAdminById(Integer adminId);

}
