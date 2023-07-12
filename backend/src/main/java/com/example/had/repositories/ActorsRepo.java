package com.example.had.repositories;

import com.example.had.entities.Actors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorsRepo extends JpaRepository<Actors, String> {
    Actors findActorsByPhoneNo(String PhoneNo);
}
