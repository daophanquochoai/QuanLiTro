package com.CNPM.QLNT.services.Inter;

import com.CNPM.QLNT.model.Bill;
import com.CNPM.QLNT.response.BillInRoom;
import com.CNPM.QLNT.response.DetailBill;
import com.CNPM.QLNT.response.InfoBill;

import java.util.List;

public interface IBillService {
    List<Bill> getAllBill();

    List<DetailBill> getAllBillByRoomId(int roomId);

    List<BillInRoom> getAllBillByStatus(int roomId, boolean status);

    Long[] getRevenue(int year);

    void addBill(BillInRoom bill);

    void deleteBill(Integer billId);

    void updateBillStatus(Integer billId);

    DetailBill getBillByRoomInMonthInYear(Integer roomId, Integer Month, Integer Year);

    List<DetailBill> getAllBillByMonthYear(Integer Month, Integer Year);

    InfoBill getInfoToAddBill(Integer roomId, Integer Month, Integer Year);
}
