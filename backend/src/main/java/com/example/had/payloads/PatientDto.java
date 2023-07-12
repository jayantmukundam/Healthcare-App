package com.example.had.payloads;

import com.example.had.entities.Hospital;
import com.example.had.entities.Supervisor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@Getter
@Setter

public class PatientDto {
    private int patientId;

    private String fname;

    private String lname;

    private String address;

    private String gender;

    private String phoneNo;

    private String dob;

    private Hospital hospital;

    private Supervisor supervisor;
}