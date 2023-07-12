package com.example.had.entities;
import com.example.had.AES.AesEncryptor;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Actors{
    @Id
    @Convert(converter= AesEncryptor.class)
    private String phoneNo;
    private String role;
}
