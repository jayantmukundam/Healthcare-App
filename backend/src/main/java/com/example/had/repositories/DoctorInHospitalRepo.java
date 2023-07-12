package com.example.had.repositories;

import com.example.had.entities.DoctorInHospital;

import com.example.had.entities.Hospital;

import com.example.had.entities.FieldWorkerInHospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorInHospitalRepo extends JpaRepository<DoctorInHospital, Integer> {
    List<DoctorInHospital> getDoctorInHospitalByHospital(Hospital hospital);

    @Query(value="SELECT * FROM doctor_in_hospital WHERE doctor_id in(SELECT doctor_id from doctors where phone_no=:phoneNo) ",nativeQuery = true)
    DoctorInHospital findByPhoneNo(@Param("phoneNo") String phoneNo);

}

