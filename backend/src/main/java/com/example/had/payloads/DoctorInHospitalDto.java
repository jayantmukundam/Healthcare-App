package com.example.had.payloads;

import com.example.had.entities.Doctor;
import com.example.had.entities.Hospital;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorInHospitalDto {

    private int docInHospId;
    private Hospital hospital;
    private Doctor doctor;
    private String registrationDate;

}

