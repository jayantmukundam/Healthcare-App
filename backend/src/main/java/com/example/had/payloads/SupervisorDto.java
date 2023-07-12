package com.example.had.payloads;

import com.example.had.entities.Hospital;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupervisorDto {
    private int supervisorId;
    private String fname;
    private String lname;
    private String gender;
    private String dob;
    private String phoneNo;
    private String address;

    private Hospital hospital;
    
    private String registrationDate;
}
