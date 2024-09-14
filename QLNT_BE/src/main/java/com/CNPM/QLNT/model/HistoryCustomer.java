package com.CNPM.QLNT.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class HistoryCustomer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int historyCustomerId;
    @ManyToOne
    @JoinColumn(name = "customerId")
    @JsonIgnore
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "roomOld", nullable = false)
    private Room roomOld;
    @ManyToOne
    @JoinColumn(name = "roomNew", nullable = true)
    private Room roomNew;
    @Column(columnDefinition = "DATETIME", nullable = false)
    private LocalDate beginDate;
    @Column(columnDefinition = "DATETIME", nullable = true)
    private LocalDate endDate;
}
