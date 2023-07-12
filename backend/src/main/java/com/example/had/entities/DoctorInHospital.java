package com.example.had.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="doctorInHospital")
@Table(name="doctorInHospital")
public class DoctorInHospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int docInHospId;

    @ManyToOne
    @JoinColumn(name="hospitalId")
    private Hospital hospital;

//    @ManyToOne
//    @JoinColumn(name="supervisorId")
//    private Supervisor supervisor;

    @OneToOne
    @JoinColumn(name="doctorId")
    private Doctor doctor;

    @Column
    private String registrationDate;
}
