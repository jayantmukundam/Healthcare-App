package com.example.had.repositories;

import com.example.had.entities.FieldWorker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FieldWorkerRepo extends JpaRepository<FieldWorker, Integer> {
    FieldWorker findFieldWorkerByPhoneNo(String phoneNo);
}
