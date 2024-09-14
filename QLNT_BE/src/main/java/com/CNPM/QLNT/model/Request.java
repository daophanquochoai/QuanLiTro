package com.CNPM.QLNT.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "Request")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "requestId", nullable = false)
    private int requestId;

    @Column(name = "createdDate", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdDate;

    @Column(name="status", nullable = false)
    private Boolean status;

    @Column(name = "message", nullable = false, columnDefinition = "nvarchar(255)")
    private String message;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customerId")
    private Customer customer;
    @Column( name = "isSend")
    private Boolean isSend;
}
