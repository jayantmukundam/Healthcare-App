package com.example.had.payloads;

import com.example.had.entities.FieldWorker;
import com.example.had.entities.Hospital;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class FieldWorkerInHospitalDto{


    private int fwInHospId;

    private Hospital hospital;

    private FieldWorker fieldWorker;
    private String registrationDate;
    private int numOfTasksAssignedPerDay;
}
