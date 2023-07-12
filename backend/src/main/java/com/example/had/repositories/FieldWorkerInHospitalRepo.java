package com.example.had.repositories;

import com.example.had.entities.FieldWorker;
import com.example.had.entities.FieldWorkerInHospital;
import com.example.had.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FieldWorkerInHospitalRepo extends JpaRepository<FieldWorkerInHospital, Integer> {
//    @Query(value="SELECT * FROM field_worker_in_hosptial WHERE num_of_tasks_per_day<=:maxTask AND hospital_id in (SELECT hospital_id FROM hospitals WHERE hospital_id=:docInHospId)",nativeQuery = true)
    @Query(value="SELECT * FROM field_worker_in_hospital WHERE num_of_tasks_assigned_per_day<5 AND hospital_id in (SELECT hospital_id FROM hospitals WHERE hospital_id=:hospitalId)",nativeQuery = true)
    List<FieldWorkerInHospital> findAllByHospitalAndNumOfTasksPerDay(int hospitalId);

    @Query(value="SELECT * FROM field_worker_in_hospital WHERE fw_id in(SELECT fw_id from fieldworkers where phone_no=:phoneNo) ",nativeQuery = true)
    FieldWorkerInHospital findByPhoneNo(@Param("phoneNo") String phoneNo);


}