package com.CNPM.QLNT.response;

import com.CNPM.QLNT.model.Customer;
import com.CNPM.QLNT.model.Room;
import lombok.Data;

import java.time.LocalDate;

@Data
public class History {
    private LocalDate beginDate;
    private LocalDate endDate;
    private Customer customer;
    private Room roomOld;
    private Room roomNew;
}
