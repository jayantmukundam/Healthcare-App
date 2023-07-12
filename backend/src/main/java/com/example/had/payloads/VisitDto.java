package com.example.had.payloads;

import com.example.had.entities.DoctorInHospital;
import com.example.had.entities.Hospital;
import com.example.had.entities.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
public class VisitDto {

    private int visitId;

    private int isActive;

    private String prescription;

    private String visitDate;

    private String symptoms;

    private Hospital hospital;

    private Patient patient;

    private DoctorInHospital doctorInHospital;
}
