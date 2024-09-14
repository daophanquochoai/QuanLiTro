package com.CNPM.QLNT.response;

import com.CNPM.QLNT.model.Contract;
import com.CNPM.QLNT.model.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InfoRoom {
    private Room room;
    private Contract contract;
}
