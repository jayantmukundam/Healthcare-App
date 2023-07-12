package com.example.had.entities;

import com.example.had.AES.AesEncryptor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="patient")
@Table(name="patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int patientId;

    @Column
    private String fname;

    @Column
    private String lname;

    @Column
    @Convert(converter= AesEncryptor.class)
    private String address;


    @Column
    @Convert(converter= AesEncryptor.class)
    private String gender;

    @Column
    @Convert(converter= AesEncryptor.class)
    private String phoneNo;

    @Column
    private String dob;

    @Column
    private String registrationDate;

    @ManyToOne
    @JoinColumn(name="hospitalId")
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name="supervisorId")
    private Supervisor supervisor;


}
