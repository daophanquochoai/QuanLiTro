package com.CNPM.QLNT.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int serviceId;
    @Column(name = "serviceName", unique = true, columnDefinition = "nvarchar(55)")
    private String serviceName;
    @Column(columnDefinition = "MONEY")
    private Long price;
    @OneToMany(mappedBy = "service", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<RoomService> roomServices;
}
