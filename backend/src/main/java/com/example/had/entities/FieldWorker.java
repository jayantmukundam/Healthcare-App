package com.example.had.entities;

import com.example.had.AES.AesEncryptor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.Optional;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "fieldworkers")
public class FieldWorker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fwId;

    private String fname;
    private String lname;

    @Convert(converter= AesEncryptor.class)
    private String gender;
    private String dob;

    @Convert(converter= AesEncryptor.class)
    private String phoneNo;

    @Convert(converter= AesEncryptor.class)
    private String address;
    private String registrationDate;

    public Optional<Object> stream() {
        return null;
    }


}
