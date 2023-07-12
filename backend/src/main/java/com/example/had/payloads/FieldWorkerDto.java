package com.example.had.payloads;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FieldWorkerDto {
    private int fwId;
    private String fname;
    private String lname;
    private String gender;
    private String dob;
    private String phoneNo;
    private String address;
    private String registrationDate;
}
