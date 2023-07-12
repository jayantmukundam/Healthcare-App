package com.example.had.repositories;

import com.example.had.entities.DoctorInHospital;
import com.example.had.entities.FollowUp;
import com.example.had.entities.Hospital;
import com.example.had.entities.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VisitRepo extends JpaRepository<Visit, Integer> {
//    @Query(value="SELECT v FROM visits v WHERE v.isActive=1 and v.visitDate=current_date")
//    public List<Visit> findActiveVisits(int hospitalId);
    public List<Visit> findAllByIsActiveAndVisitDateAndHospitalAndDoctorInHospital(int isActive, String date, Hospital hospital,DoctorInHospital doctorInHospital);

    @Query(value="SELECT * FROM visits WHERE visit_id!=:visitId and patient_id=:patientId and is_active=0",nativeQuery = true)
    public List<Visit> findAllByIdAndPatient(@Param("visitId") int visitId, @Param("patientId")int patientId);

//    @Query(value="SELECT visit_id FROM visits WHERE doctor_in_hospital=:docInHospId",nativeQuery = true)
//    public List<Integer> findAllByDoctorInHospital(@Param("docInHospId") int docInHospId);

}
