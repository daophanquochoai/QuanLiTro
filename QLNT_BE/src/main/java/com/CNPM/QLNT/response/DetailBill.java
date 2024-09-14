package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DetailBill {
    private Integer billId;
    private LocalDate beginDate;
    private LocalDate endDate;
    private Integer electricNumberBegin;
    private Integer electricNumberEnd;
    private Integer waterNumberBegin;
    private Integer waterNumberEnd;
    private String note;
    private Long total;
    private Boolean isPaid;
    private Integer roomId;
    private Integer electricPrice;
    private Integer waterPrice;
    private Long roomPrice;
    private List<InfoService> service;
}
