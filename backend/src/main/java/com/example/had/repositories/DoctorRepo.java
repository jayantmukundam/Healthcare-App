package com.example.had.repositories;

import com.example.had.entities.Doctor;
import com.example.had.entities.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepo extends JpaRepository<Doctor, Integer> {

    Doctor findDoctorByPhoneNo(String phoneNo);
}
