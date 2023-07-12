package com.example.had.repositories;

import com.example.had.entities.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupervisorRepo extends JpaRepository<Supervisor, Integer> {
    Supervisor findSupervisorByPhoneNo(String phoneNo);
}
