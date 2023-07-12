package com.example.had.repositories;

import com.example.had.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdminRepo extends JpaRepository<Admin, Integer> {

    Admin findAdminByPhoneNo(String phoneNo);
}
