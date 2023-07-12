package com.example.had.repositories;

import com.example.had.entities.FieldWorkerInHospital;
import com.example.had.entities.FollowUp;
import com.example.had.entities.Hospital;
import com.example.had.entities.Visit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import com.example.had.entities.FollowUp;
import org.springframework.stereotype.Repository;


public interface FollowUpRepo extends JpaRepository<FollowUp,Integer> {

    public List<FollowUp> findAllByIsActiveAndFieldWorkerInHospital(int IsActive, FieldWorkerInHospital fieldWorkerInHospital);

//    @Query(value="SELECT * FROM follow_up WHERE is_active=0 and follow_ups_id!=:followUpId and visit_id in (SELECT visit_id FROM visits WHERE doctor_in_hospital=:docInHospId)",nativeQuery = true)
    @Query(value="SELECT * FROM follow_up WHERE follow_ups_id!=:followUpId and visit_id=:visitId and is_active=0",nativeQuery = true)
    public List<FollowUp> findAllByIdAndVisit(@Param("followUpId") int followUpId, @Param("visitId") int visitId);

    @Query(value="SELECT * FROM follow_up WHERE is_active=2 AND visit_id in (SELECT visit_id FROM visits WHERE doctor_in_hospital=:docInHospId)",nativeQuery = true)
    public List<FollowUp> findAllByVisits(@Param("docInHospId") int docInHospId);
    @Query(value="SELECT * FROM follow_up WHERE fw_in_hosp_id IS NULL AND follow_up_date=:curr_date AND visit_id in (SELECT visit_id FROM visits where hospital_id=:hospitalId)",nativeQuery = true)
    public List<FollowUp> findRemainingFollowUps(@Param("hospitalId")int hospitalId, @Param("curr_date")String curr_date);
}
