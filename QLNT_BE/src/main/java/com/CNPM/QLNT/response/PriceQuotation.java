package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceQuotation {
    private int electricPrice;
    private LocalDateTime timeChangedElectric;
    private int waterPrice;
    private LocalDateTime timeChangedWater;
}
