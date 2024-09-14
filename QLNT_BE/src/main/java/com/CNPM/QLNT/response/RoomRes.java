package com.CNPM.QLNT.response;

import com.CNPM.QLNT.model.RoomType;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class RoomRes {
    private int roomId;
    private int limit;
    private int roomTypeId;
    private Long price;
}
