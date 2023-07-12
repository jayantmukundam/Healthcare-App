package com.example.had.entities;

import com.example.had.AES.AesEncryptor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Reference;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "supervisors")
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int supervisorId;

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

    @OneToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "hospitalId", unique = true)
    private Hospital hospital;
}
