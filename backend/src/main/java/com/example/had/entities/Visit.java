package com.example.had.entities;

import com.example.had.AES.AesEncryptor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="visits")
@Table(name="visits")
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int visitId;

    @Column
    private int isActive;

    @Column
    @Convert(converter= AesEncryptor.class)
    private String prescription;

    @Column
    private String visitDate;

    @Column
    @Convert(converter= AesEncryptor.class)
    private String symptoms;


    @ManyToOne
    @JoinColumn(name="hospitalId")
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name="patientId", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name="doctorInHospital")
    private DoctorInHospital doctorInHospital;
}
