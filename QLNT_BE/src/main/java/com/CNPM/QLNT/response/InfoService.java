package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InfoService {
    private  int serviceId;
    private String serviceName;
    private Long price;
    private int quantity;
}
