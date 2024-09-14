package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InfoRoomService {
    private LocalDate beginDate;
    private LocalDate endDate;
    private Integer roomId;
    private Integer serviceId;
    private Integer quantity;
}
