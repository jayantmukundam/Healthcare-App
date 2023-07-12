package com.example.had.repositories;

import com.example.had.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HospitalRepo extends JpaRepository<Hospital, Integer> {

    @Query(value = "SELECT * FROM hospitals WHERE hospital_id NOT IN (SELECT hospital_id FROM supervisors)", nativeQuery = true)
    public List<Hospital> findSupervisorNotAssignedHospitals();
}
