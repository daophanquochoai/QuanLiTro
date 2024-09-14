package com.CNPM.QLNT.response;

import lombok.*;

import java.time.LocalDate;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class BillInRoom {
    private int billId;
    private LocalDate beginDate;
    private LocalDate endDate;
    private int electricNumberBegin;
    private int electricNumberEnd;
    private int waterNumberBegin;
    private int waterNumberEnd;
    private String note;
    private Long total;
    private boolean isPaid;
    private int roomId;
}
