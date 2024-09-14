package com.CNPM.QLNT.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "Room")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class Room {

    @Id
    @Column(name = "roomId")
    private int roomId;
    @ManyToOne( cascade = CascadeType.ALL)
    @JoinColumn(name = "roomTypeId", referencedColumnName = "roomTypeId", nullable = false)
    private RoomType roomType;

    @Column(name = "limit", nullable = false)
    private int limit;

    @Column(name = "price", nullable = false, columnDefinition = "money")
    private Long price;

    @OneToMany(mappedBy = "room",  fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Bill> bill;

    @OneToMany(mappedBy = "room", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<RoomService> roomService;

}
