package com.example.had.payloads;

import lombok.*;

import java.io.Serializable;

@Data
public class AuthRequestDto{
    private String otp;
    private String phoneNo;
}
