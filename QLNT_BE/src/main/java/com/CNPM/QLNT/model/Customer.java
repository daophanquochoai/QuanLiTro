package com.CNPM.QLNT.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Customer")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customerId", nullable = false)
    private int customerId;

    @Column(name = "firstName", nullable = false, columnDefinition = "nvarchar(55)")
    private String firstName;

    @Column(name = "lastName", nullable = false, columnDefinition = "nvarchar(55)")
    private String lastName;

    @Column(name = "identifier", nullable = false, unique = true, columnDefinition = "varchar(12)")
    private String identifier;

    @Column(name = "dateOfBirth", nullable = false, columnDefinition = "DATE")
    private LocalDate dateOfBirth;

    @Column(name = "sex", nullable = false)
    private Boolean sex;

    @Column(name = "infoAddress", nullable = false, columnDefinition = "nvarchar(100)")
    private String infoAddress;

    @Column(name = "phoneNumber", unique = true, nullable = false, columnDefinition = "varchar(10)")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @OneToOne( cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "userAuthId")
    private UserAuth userAuthId = null;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer", fetch = FetchType.EAGER)
    @JsonIgnore
    @Column(name = "historyCustomer")
    private List<HistoryCustomer> historyCustomer = new ArrayList<>();


}
