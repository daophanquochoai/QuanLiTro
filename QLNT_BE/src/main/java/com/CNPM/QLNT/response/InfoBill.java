package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class InfoBill {
    private Integer electricNumberBegin;
    private Integer waterNumberBegin;
    private Integer electricPrice;
    private Integer waterPrice;
    private Long roomPrice;
    private List<InfoService> service;
}
