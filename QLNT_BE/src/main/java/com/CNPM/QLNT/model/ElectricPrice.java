package com.CNPM.QLNT.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ElectricPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int electricPriceId;
    @Column(name = "changedDate", columnDefinition = "DATETIME")
    private LocalDateTime changedDate;
    @Column(name = "price", columnDefinition = "money")
    private int price;
}
