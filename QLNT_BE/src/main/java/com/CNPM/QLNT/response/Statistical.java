package com.CNPM.QLNT.response;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Statistical {
    private Long[] revenue;
    private int numberOfUnpaidRoom;
    private int numberOfPaidRoom;
    private int numberOfFullRoom;
    private int numberOfAvailableRoom;
    private int numberOfEmptyRoom;
}
