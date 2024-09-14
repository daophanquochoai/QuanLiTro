package com.CNPM.QLNT.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UserAuth")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class UserAuth {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;
    @Column(name = "userName", nullable = false, unique = true)
    private String username;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role", nullable = false)
    private String role;
    @Column(nullable = false)
    private Boolean active;

}
