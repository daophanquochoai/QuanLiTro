package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RequestInfo {
    private int requestId;
    private LocalDateTime createdDate;
    private Boolean status;
    private String message;
    private Boolean isSend;
    private String firstName;
    private String lastName;
    private int roomId;
}
