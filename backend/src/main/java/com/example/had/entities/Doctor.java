package com.example.had.entities;

import com.example.had.AES.AesEncryptor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doctorId;

    private String fname;
    private String lname;
    private String gender;
    private String dob;

    @Convert(converter= AesEncryptor.class)
    private String phoneNo;

    private String address;
    private String registrationDate;
}
