package com.CNPM.QLNT.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "RoomService", uniqueConstraints = @UniqueConstraint(columnNames = {"roomId", "serviceId"}))
public class RoomService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roomServiceId")
    private int roomServiceId;
    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "roomId",referencedColumnName = "roomId")
    private Room room;
    @ManyToOne
    @JoinColumn(name = "serviceId",referencedColumnName = "serviceId")
    private Service service;
    private int quantity;
    private LocalDate beginDate;
    private LocalDate endDate;
}
