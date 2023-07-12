package com.example.had.repositories;

import com.example.had.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PatientRepo extends JpaRepository<Patient, Integer>{

}
