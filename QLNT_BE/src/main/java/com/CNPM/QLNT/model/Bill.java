package com.CNPM.QLNT.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Bill")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "billId")
    private int billId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "roomId")
    @JsonIgnore
    private Room room;

    @Column(name = "beginDate", nullable = false, columnDefinition = "DATE")
    private LocalDate beginDate;

    @Column(name = "endDate", nullable = false, columnDefinition = "DATE")
    private LocalDate endDate;

    @Column(name = "electricNumberBegin", nullable = false)
    private int electricNumberBegin;

    @Column(name = "electricNumberEnd", nullable = false)
    private int electricNumberEnd;

    @Column(name = "waterNumberBegin", nullable = false)
    private int waterNumberBegin;

    @Column(name = "waterNumberEnd", nullable = false)
    private int waterNumberEnd;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "note", columnDefinition = "nvarchar(255)")
    private String note;

    @Column(name = "total", columnDefinition = "MONEY")
    private Long total;

    @Override
    public String toString() {
        return "Bill{" +
                "billId=" + billId +
//                ", roomId=" + roomId +
                ", beginDate=" + beginDate +
                ", endDate=" + endDate +
                ", electricNumberBegin=" + electricNumberBegin +
                ", electricNumberEnd=" + electricNumberEnd +
                ", waterNumberBegin=" + waterNumberBegin +
                ", waterNumberEnd=" + waterNumberEnd +
                ", status=" + status +
                ", ghiChu='" + note + '\'' +
                ", total=" + total +
                '}';
    }
}
