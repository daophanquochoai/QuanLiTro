package com.CNPM.QLNT.response;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InfoContract {
    private Integer customerId;
    private Integer roomId;
    private LocalDate createdDate;
    private LocalDate beginDate;
    private LocalDate endDate;
    private Boolean status;
}
