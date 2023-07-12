package com.example.had.entities;

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
@Table(name = "hospitals")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int hospitalId;

    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String address;

    private String registrationDate;

//    @OneToOne(mappedBy = "hospital")
//    private Supervisor supervisor;
}
