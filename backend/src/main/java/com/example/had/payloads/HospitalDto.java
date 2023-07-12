package com.example.had.payloads;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HospitalDto {
    private int hospitalId;
    private String name;
    private String address;
    private String registrationDate;
}
