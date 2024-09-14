package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Report {
    private List<BillInRoom> unpaidRoomList;
    private List<BillInRoom> paidRoomList;
}
