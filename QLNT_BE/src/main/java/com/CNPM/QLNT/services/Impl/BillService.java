package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.*;
import com.CNPM.QLNT.repository.BillRepo;
import com.CNPM.QLNT.repository.RoomRepo;
import com.CNPM.QLNT.repository.RoomServiceRepo;
import com.CNPM.QLNT.response.*;
import com.CNPM.QLNT.services.Inter.IBillService;
import com.CNPM.QLNT.services.Inter.IPriceService;
import com.CNPM.QLNT.services.Inter.IRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillService implements IBillService {
    private final BillRepo billRepo;
    private final IPriceService iPriceService;
    private final IRoomService iRoomService;
    private final RoomServiceRepo roomServiceRepo;

    @Override
    public List<Bill> getAllBill() {
        return billRepo.getAllBill();
    }

    @Override
    public List<DetailBill> getAllBillByRoomId(int roomId) {
        Optional<List<Bill>> listB = Optional.ofNullable(billRepo.getAllBillByRoomId(roomId));
        if (listB.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        List<WaterPrice> waterList = iPriceService.getAllWaterPrice();
        List<ElectricPrice> electricList = iPriceService.getAllElectricPrice();
        List<DetailBill> detailBillList = new ArrayList<>();
        listB.get().stream().forEach(b -> {
            WaterPrice water = new WaterPrice();
            for (WaterPrice w : waterList) {
                if (w.getChangedDate().getYear() < b.getBeginDate().getYear()) {
                    water = w;
                    break;
                } else if (w.getChangedDate().getYear() == b.getBeginDate().getYear() &&
                    w.getChangedDate().getMonth().getValue() < b.getBeginDate().getMonthValue()) {
                    water = w;
                    break;
                }
            }
            ElectricPrice electric = new ElectricPrice();
            for (ElectricPrice e : electricList) {
                if (e.getChangedDate().getYear() < b.getBeginDate().getYear()) {
                    electric = e;
                    break;
                } else if (e.getChangedDate().getYear() == b.getBeginDate().getYear() &&
                    e.getChangedDate().getMonth().getValue() < b.getBeginDate().getMonthValue()) {
                    electric = e;
                    break;
                }
            }
            List<InfoService> service = roomServiceRepo
                .getAllServiceByRoomIdMonthYear(roomId, b.getBeginDate().getMonthValue(), b.getBeginDate().getYear());
            DetailBill db = new DetailBill();
            db.setElectricNumberBegin(b.getElectricNumberBegin());
            db.setElectricNumberEnd(b.getElectricNumberEnd());
            db.setBillId(b.getBillId());
            db.setBeginDate(b.getBeginDate());
            db.setEndDate(b.getEndDate());
            db.setWaterNumberBegin(b.getWaterNumberBegin());
            db.setWaterNumberEnd(b.getWaterNumberEnd());
            db.setNote(b.getNote());
            db.setWaterPrice(water.getPrice());
            db.setElectricPrice(electric.getPrice());
            db.setTotal(b.getTotal());
            db.setIsPaid(b.getStatus());
            db.setRoomId(b.getRoom().getRoomId());
            db.setRoomPrice(b.getRoom().getPrice());
            db.setService(service);
            detailBillList.add(db);
        });
        return detailBillList;
    }

    @Override
    public List<BillInRoom> getAllBillByStatus(int room, boolean status) {
        Optional<List<Bill>> listB = Optional.ofNullable(billRepo.getBillByStatus(status, room));
        if (listB.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        List<BillInRoom> listBR = new ArrayList<>();
        listB.get().stream().forEach(b -> {
            BillInRoom br = new BillInRoom();
            br.setElectricNumberBegin(b.getElectricNumberBegin());
            br.setElectricNumberEnd(b.getElectricNumberEnd());
            br.setBillId(b.getBillId());
            br.setBeginDate(b.getBeginDate());
            br.setEndDate(b.getEndDate());
            br.setWaterNumberBegin(b.getWaterNumberBegin());
            br.setWaterNumberEnd(b.getWaterNumberEnd());
            br.setNote(b.getNote());
            br.setTotal(b.getTotal());
            br.setPaid(b.getStatus());
            br.setRoomId(b.getRoom().getRoomId());
            listBR.add(br);
        });
        return listBR;
    }

    @Override
    public Long[] getRevenue(int year) {
        Long[] revenue = new Long[12];
        for (int i = 0; i < 12; i++) {
            revenue[i] = billRepo.getAllBillByMonthYear(i + 1, year).stream().filter(Bill::getStatus)
                .mapToLong(Bill::getTotal).sum();
        }
        return revenue;
    }

    @Override
    public void addBill(BillInRoom billInRoom) {
        try {
            Bill b = new Bill();
            if (billInRoom.getBeginDate() == null) {
                throw new ResourceNotFoundException("Ngày bắt đầu không hợp lệ");
            } else {
                b.setBeginDate(billInRoom.getBeginDate());
            }
            if (billInRoom.getEndDate() == null) {
                throw new ResourceNotFoundException("Ngày kết thúc không hợp lệ");
            } else {
                if (billInRoom.getEndDate().isAfter(billInRoom.getBeginDate())) {
                    b.setEndDate(billInRoom.getEndDate());
                } else {
                    throw new ResourceNotFoundException("Ngày kết thúc không hợp lệ");
                }
            }
            if (billInRoom.getElectricNumberBegin() >= 0) {
                b.setElectricNumberBegin(billInRoom.getElectricNumberBegin());
            } else throw new ResourceNotFoundException("1");
            if (billInRoom.getElectricNumberEnd() >= billInRoom.getElectricNumberBegin()) {
                b.setElectricNumberEnd(billInRoom.getElectricNumberEnd());
            } else {
                throw new ResourceNotFoundException("Số điện kết thúc không hợp lệ");
            }
            if (billInRoom.getWaterNumberBegin() >= 0) {
                b.setWaterNumberBegin(billInRoom.getWaterNumberBegin());
            } else throw new ResourceNotFoundException("2");
            if (billInRoom.getWaterNumberEnd() >= billInRoom.getWaterNumberBegin()) {
                b.setWaterNumberEnd(billInRoom.getWaterNumberEnd());
            } else {
                throw new ResourceNotFoundException("Số nước kết thúc không hợp lệ");
            }
            Optional<Room> room = iRoomService.getRoomByRoomId(billInRoom.getRoomId());
            if (room.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy phòng");
            else b.setRoom(room.get());
            b.setNote(billInRoom.getNote());
            b.setTotal(billInRoom.getTotal());
            b.setStatus(false);
            billRepo.save(b);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Dữ liệu sai");
        }
    }

    @Override
    public void updateBillStatus(Integer billId) {
        Optional<Bill> b = billRepo.findById(billId);
        if (b.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        b.get().setStatus(!b.get().getStatus());
        billRepo.save(b.get());
    }

    @Override
    public void deleteBill(Integer billId) {
        Optional<Bill> b = billRepo.findById(billId);
        if (b.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        if (b.get().getStatus()) throw new ResourceNotFoundException("Không thể xóa do hóa đơn đã được thanh toán");
        billRepo.delete(b.get());
    }

    @Override
    public DetailBill getBillByRoomInMonthInYear(Integer roomId, Integer Month, Integer Year) {
        List<WaterPrice> waterList = iPriceService.getAllWaterPrice();
        List<ElectricPrice> electricList = iPriceService.getAllElectricPrice();
        WaterPrice water = new WaterPrice();
        for (WaterPrice w : waterList) {

            if (w.getChangedDate().getYear() < Year) {
                water = w;
                break;
            } else if (w.getChangedDate().getYear() == Year && w.getChangedDate().getMonth().getValue() <= Month) {
                water = w;
                break;
            }
        }
        ElectricPrice electric = new ElectricPrice();
        for (ElectricPrice e : electricList) {
            if (e.getChangedDate().getYear() < Year) {
                electric = e;
                break;
            } else if (e.getChangedDate().getYear() == Year && e.getChangedDate().getMonth().getValue() <= Month) {
                electric = e;
                break;
            }
        }
        Optional<Bill> bill = billRepo.getBillByRoomInMonthInYear(roomId, Month, Year);
        if (bill.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        List<InfoService> service = roomServiceRepo.getAllServiceByRoomIdMonthYear(roomId, Month, Year);
        DetailBill detailBill = new DetailBill();
        detailBill.setBillId(bill.get().getBillId());
        detailBill.setBeginDate(bill.get().getBeginDate());
        detailBill.setEndDate(bill.get().getEndDate());
        detailBill.setElectricNumberBegin(bill.get().getElectricNumberBegin());
        detailBill.setElectricNumberEnd(bill.get().getElectricNumberEnd());
        detailBill.setWaterNumberBegin(bill.get().getWaterNumberBegin());
        detailBill.setWaterNumberEnd(bill.get().getWaterNumberEnd());
        detailBill.setNote(bill.get().getNote());
        detailBill.setTotal(bill.get().getTotal());
        detailBill.setIsPaid(bill.get().getStatus());
        detailBill.setRoomId(roomId);
        detailBill.setWaterPrice(water.getPrice());
        detailBill.setElectricPrice(electric.getPrice());
        long total = 0L;
        total += (long) detailBill.getWaterPrice() * (bill.get().getWaterNumberEnd() - bill.get().getWaterNumberBegin()) + (long) detailBill.getElectricPrice() * (bill.get().getElectricNumberEnd() - bill.get().getElectricNumberBegin());
        total += service.stream().mapToLong(s -> s.getQuantity() * s.getPrice()).sum();
        detailBill.setRoomPrice(bill.get().getTotal() - total);
        detailBill.setService(service);
        return detailBill;
    }

    @Override
    public List<DetailBill> getAllBillByMonthYear(Integer Month, Integer Year) {
        Optional<List<Bill>> listB = Optional.ofNullable(billRepo.getAllBillByMonthYear(Month, Year));
        if (listB.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        List<WaterPrice> waterList = iPriceService.getAllWaterPrice();
        List<ElectricPrice> electricList = iPriceService.getAllElectricPrice();
        List<DetailBill> detailBillList = new ArrayList<>();
        listB.get().stream().forEach(b -> {
            WaterPrice water = new WaterPrice();
            for (WaterPrice w : waterList) {
                if (w.getChangedDate().getYear() < Year) {
                    water = w;
                    break;
                } else if (w.getChangedDate().getYear() == Year &&
                    w.getChangedDate().getMonth().getValue() <= Month) {
                    water = w;
                    break;
                }
            }
            ElectricPrice electric = new ElectricPrice();
            for (ElectricPrice e : electricList) {
                if (e.getChangedDate().getYear() < Year) {
                    electric = e;
                    break;
                } else if (e.getChangedDate().getYear() == Year &&
                    e.getChangedDate().getMonth().getValue() <= Month) {
                    electric = e;
                    break;
                }
            }

            List<InfoService> service = roomServiceRepo
                .getAllServiceByRoomIdMonthYear(b.getRoom().getRoomId(), Month, Year);
            DetailBill db = new DetailBill();
            db.setElectricNumberBegin(b.getElectricNumberBegin());
            db.setElectricNumberEnd(b.getElectricNumberEnd());
            db.setBillId(b.getBillId());
            db.setBeginDate(b.getBeginDate());
            db.setEndDate(b.getEndDate());
            db.setWaterNumberBegin(b.getWaterNumberBegin());
            db.setWaterNumberEnd(b.getWaterNumberEnd());
            db.setNote(b.getNote());
            db.setWaterPrice(water.getPrice());
            db.setElectricPrice(electric.getPrice());
            db.setTotal(b.getTotal());
            db.setIsPaid(b.getStatus());
            db.setRoomId(b.getRoom().getRoomId());
            long total = 0L;
            total += (long) db.getWaterPrice() * (b.getWaterNumberEnd() - b.getWaterNumberBegin()) + (long) db.getElectricPrice() * (b.getElectricNumberEnd() - b.getElectricNumberBegin());
            total += service.stream().mapToLong(s -> s.getQuantity() * s.getPrice()).sum();
            db.setRoomPrice(b.getTotal() - total);
            db.setService(service);
            detailBillList.add(db);
        });
        return detailBillList;
    }

    @Override
    public InfoBill getInfoToAddBill(Integer roomId, Integer Month, Integer Year) {
        List<WaterPrice> waterList = iPriceService.getAllWaterPrice();
        List<ElectricPrice> electricList = iPriceService.getAllElectricPrice();
        WaterPrice water = new WaterPrice();
        for (WaterPrice w : waterList) {
            if (w.getChangedDate().getYear() < Year) {
                water = w;
                break;
            } else if (w.getChangedDate().getYear() == Year && w.getChangedDate().getMonth().getValue() <= Month) {
                water = w;
                break;
            }
        }
        ElectricPrice electric = new ElectricPrice();
        for (ElectricPrice e : electricList) {
            if (e.getChangedDate().getYear() < Year) {
                electric = e;
                break;
            } else if (e.getChangedDate().getYear() == Year && e.getChangedDate().getMonth().getValue() <= Month) {
                electric = e;
                break;
            }
        }
        InfoBill infoBill = new InfoBill();
        Optional<Room> room = iRoomService.getRoomByRoomId(roomId);
        Optional<Bill> bill = billRepo.getPreviousBillByRoomId(roomId).stream().findFirst();
        List<InfoService> service = roomServiceRepo.getAllServiceByRoomIdMonthYear(roomId, Month, Year);
        if (bill.isEmpty()) {
            infoBill.setElectricNumberBegin(0);
            infoBill.setWaterNumberBegin(0);
        } else {
            infoBill.setElectricNumberBegin(bill.get().getElectricNumberEnd());
            infoBill.setWaterNumberBegin(bill.get().getWaterNumberEnd());
        }
        infoBill.setWaterPrice(water.getPrice());
        infoBill.setElectricPrice(electric.getPrice());
        infoBill.setRoomPrice(room.get().getPrice());
        infoBill.setService(service);
        return infoBill;
    }
}
