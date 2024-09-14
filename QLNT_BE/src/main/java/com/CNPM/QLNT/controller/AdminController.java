package com.CNPM.QLNT.controller;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.*;
import com.CNPM.QLNT.response.*;
import com.CNPM.QLNT.services.Inter.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Slf4j
public class AdminController {
    private final ICustomerService iCustomerService;
    private final IContractService iContractService;
    private final IPriceService iPriceService;
    private final IRoomService iRoomService;
    private final IRoomTypeService iRoomTypeService;
    private final IBillService iBillService;
    private final IRequestService iRequestService;
    private final IHistoryCustomerService iHistoryCustomerService;
    private final IRoomService_Service iRoomServiceService;
    private final IService_Service iServiceService;
    private final IMailService iMailService;

    //===========================ROOM===========================
    @GetMapping("/room/all")
    public ResponseEntity<List<RoomRes>> getAllRoom() throws SQLException {
        return ResponseEntity.ok(iRoomService.getAllRoom());
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable int roomId) {
        Optional<Room> Room = iRoomService.getRoomByRoomId(roomId);
        if (Room.isPresent()) {
            Room r = Room.get();
            return ResponseEntity.ok(new RoomRes(r.getRoomId(), r.getLimit(), r.getRoomType().getRoomTypeId(), r.getPrice()));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không tìm thấy phòng");
        }
    }

    @GetMapping("/room/withContract")
    public ResponseEntity<?> getAllRoomWithContract() {
        try {
            return ResponseEntity.ok(iRoomService.getAllRoomWithContract());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    // Lấy ra các phòng cần tính hóa đơn
    @GetMapping("/room/bill/{month}/{year}")
    public ResponseEntity<?> getRoomForBill(
        @PathVariable int month,
        @PathVariable int year) {
        try {
            return ResponseEntity.ok(iRoomService.getRoomForBillByMonth(month, year));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //Lấy ra các phòng tùy theo trạng thái (trống/chưa đầy/đầy)
    @GetMapping("/room/limit/{type}")
    public ResponseEntity<?> getAllRoomByLimit(@PathVariable int type) {
        try {
            return ResponseEntity.ok(iRoomService.getAllRoomByLimit(type));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/room/add")
    @Transactional
    public ResponseEntity<?> addRoom(@RequestBody RoomRes roomRes) {
        try {
            iRoomService.addRoom(roomRes);
            return ResponseEntity.ok("Thêm phòng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/room/{roomId}/update")
    @Transactional
    public ResponseEntity<?> updateRoom(@PathVariable int roomId, @RequestBody RoomRes roomRes) {
        try {
            Optional<Room> Room = iRoomService.getRoomByRoomId(roomId);
            if (Room.isPresent()) {
                iRoomService.updateRoom(roomId, roomRes);
                return ResponseEntity.ok("Thay đổi thông tin phòng thành công");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không thể tìm thấy phòng");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/room/{roomId}/delete")
    public ResponseEntity<?> deleteRoom(@PathVariable int roomId) {
        try {
            iCustomerService.getAllCustomer().stream().forEach(
                c -> {
                    if (c.getRoomId() == roomId) {
                        throw new ResourceNotFoundException("Phòng đang có người ở");
                    }
                }
            );
            iContractService.getAllContract().stream().forEach(
                c -> {
                    if (c.getRoom().getRoomId() == roomId && c.getEndDate().isAfter(LocalDate.now())) {
                        throw new ResourceNotFoundException("Hợp đồng chưa hết hạn");
                    }
                }
            );

            iRoomService.deleteRoom(roomId);
            return ResponseEntity.ok("Xóa phòng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================CUSTOMER===========================
    @GetMapping("/customer/all")
    public ResponseEntity<List<InfoUser>> getAllCustomer() {
        return ResponseEntity.ok(iCustomerService.getAllCustomer());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerByCustomerId(@PathVariable int customerId) {
        try {
            Optional<Customer> theCustomer = iCustomerService.getCustomer(customerId);
            if (theCustomer.isEmpty()) {
                throw new ResourceNotFoundException("Không tìm thấy khách thuê");
            }
            InfoUser user = new InfoUser(
                theCustomer.get().getCustomerId(),
                theCustomer.get().getFirstName(),
                theCustomer.get().getLastName(),
                theCustomer.get().getIdentifier(),
                theCustomer.get().getDateOfBirth(),
                theCustomer.get().getSex(),
                theCustomer.get().getInfoAddress(),
                theCustomer.get().getPhoneNumber(),
                theCustomer.get().getEmail(),
                theCustomer.get().getHistoryCustomer() == null ? null : theCustomer.get().getHistoryCustomer().stream().filter(t -> t.getEndDate() == null).findFirst().get().getRoomOld().getRoomId(),
                theCustomer.get().getUserAuthId() == null ? "Chưa có tài khoản" : theCustomer.get().getUserAuthId().getUsername(),
                theCustomer.get().getUserAuthId() == null ? "Chưa có tài khoản" : theCustomer.get().getUserAuthId().getPassword());
            return ResponseEntity.of(Optional.of(user));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/customer/room/{roomId}")
    public ResponseEntity<?> getAllCustomerByRoomId(@PathVariable int roomId) {
        try {
            return ResponseEntity.ok(iCustomerService.getCustomerByRoomId(roomId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/customer/add")
    @Transactional
    public ResponseEntity<?> addCustomer(@RequestBody InfoUser info) {
        try {
            Boolean check = iCustomerService.addCustomer(info);
            return check ? ResponseEntity.ok("Thêm khách thuê thành công")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Phòng đã đầy");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/customer/{customerId}/update")
    @Transactional
    public ResponseEntity<?> updateCustomer(@PathVariable int customerId,
                                            @RequestBody InfoUser info) {
        try {
            iCustomerService.updateCustomer(customerId, info);
            return ResponseEntity.ok("Thay đổi thông tin khách thuê thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/customer/{customerId}/delete")
    public ResponseEntity<?> deleteCustomer(@PathVariable int customerId) {
        try {
            Customer customer = iCustomerService.getCustomer(customerId).get();
            Optional<HistoryCustomer> h = customer.getHistoryCustomer().stream().filter(t -> t.getEndDate() == null).findFirst();
            if (h.isPresent()) {
                InfoUser infoUser = new InfoUser();
                iCustomerService.updateCustomer(customerId, infoUser);
                return ResponseEntity.ok("Khách thuê đã trả phòng thành công");
            } else {
                iCustomerService.deleteCustomer(customerId);
                return ResponseEntity.ok("Xóa khách thuê thành công");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================PRICE QUOTATION===========================
    @GetMapping("/price/water/all")
    public ResponseEntity<List<?>> getAllWaterPrice() {
        return ResponseEntity.ok(iPriceService.getAllWaterPrice());
    }

    @GetMapping("/price/electric/all")
    public ResponseEntity<List<?>> getAllElectricPrice() {
        return ResponseEntity.ok(iPriceService.getAllElectricPrice());
    }

    @PostMapping("/price/electric/add")
    @Transactional
    public ResponseEntity<?> savePriceQuotation(@RequestBody ElectricPrice e) {
        try {
            iPriceService.saveElectricPrice(e);
            return ResponseEntity.ok("Thay đổi giá điện thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }

    @PostMapping("/price/water/add")
    @Transactional
    public ResponseEntity<?> savePriceQuotation(@RequestBody WaterPrice w) {
        try {
            iPriceService.saveWaterPrice(w);
            return ResponseEntity.ok("Thay đổi giá nước thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }

    //===========================ROOM TYPE===========================
    @GetMapping("/roomType/all")
    public ResponseEntity<?> getAllRoomType() {
        return ResponseEntity.ok(iRoomTypeService.getAllRoomType());
    }

    @PostMapping("/roomType/add")
    @Transactional
    public ResponseEntity<?> addRoomType(@RequestBody RoomType roomType) {
        try {
            iRoomTypeService.addRoomType(roomType);
            return ResponseEntity.ok("Thêm loại phòng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/roomType/{roomTypeId}/delete")
    @Transactional
    public ResponseEntity<?> deleteRoomType(@PathVariable int roomTypeId) {
        try {
            iRoomService.getAllRoom().stream().forEach(
                r -> {
                    if (r.getRoomTypeId() == roomTypeId) {
                        throw new ResourceNotFoundException("Đang có phòng thuộc loại này");
                    }
                }
            );
            iRoomTypeService.deleteRoomType(roomTypeId);
            return ResponseEntity.ok("Xóa loại phòng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================BILL===========================
    @GetMapping("/bill/all")
    public ResponseEntity<?> getAllBill() {
        try {
            return ResponseEntity.ok(iBillService.getAllBill());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/bill/{billId}/update")
    public ResponseEntity<?> updateBillStatus(@PathVariable Integer billId) {
        try {
            iBillService.updateBillStatus(billId);
            return ResponseEntity.ok("Hóa đơn đã được cập nhật trạng thái");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/bill/add")
    @Transactional
    public ResponseEntity<?> billCalculation(@RequestBody BillInRoom billInRoom) {
        try {
            iBillService.addBill(billInRoom);
            return ResponseEntity.ok("Thêm hóa đơn thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/bill/{billId}/delete")
    @Transactional
    public ResponseEntity<?> deleteBillById(@PathVariable Integer billId) {
        try {
            iBillService.deleteBill(billId);
            return ResponseEntity.ok("Hóa đơn đã được xóa");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/bill/{month}/{year}")
    public ResponseEntity<?> getBillByMonthYear(
        @PathVariable Integer month,
        @PathVariable Integer year
    ) {
        try {
            if (month > 12 || month <= 0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("month");
            if (year > LocalDate.now().getYear() || year < 0)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("year");
            return ResponseEntity.ok(iBillService.getAllBillByMonthYear(month, year));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    // Lấy thông tin phòng để tính hóa đơn
    @GetMapping("bill/info/{roomId}/{month}/{year}")
    public ResponseEntity<?> getInfoBillByRoomId(@PathVariable Integer roomId,
                                                 @PathVariable Integer month,
                                                 @PathVariable Integer year) {
        try {
            return ResponseEntity.ok(iBillService.getInfoToAddBill(roomId, month, year));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================REQUEST===========================
    @GetMapping("/request/all")
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(iRequestService.getAllRequestOfCustomer());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //Lấy tất cả yêu cầu của khách (true = đã xử lý / false = chưa xử lý)
    @GetMapping("/request/{status}")
    public ResponseEntity<?> getRequest(@PathVariable boolean status) {
        try {
            return ResponseEntity.ok(iRequestService.getAllRequestOfCustomerByStatus(status));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/request/{requestId}/update")
    public ResponseEntity<?> updateRequest(@PathVariable int requestId) {
        try {
            iRequestService.updateRequest(requestId);
            return ResponseEntity.ok("Đã xử lý yêu cầu");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/request/{requestId}/delete")
    @Transactional
    public ResponseEntity<?> deleteRequestByRequestId(@PathVariable int requestId) {
        try {
            iRequestService.deleteCommunication(requestId);
            return ResponseEntity.ok("Yêu cầu đã được xóa");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================STATISTICAL===========================
    @GetMapping("/statistical")
    public ResponseEntity<?> getStatistical() {
        try {
            List<DetailBill> l = iBillService.getAllBillByMonthYear(LocalDate.now().getMonth().getValue() - 1, LocalDate.now().getYear());
            Statistical sta = new Statistical();
            sta.setRevenue(iBillService.getRevenue(LocalDate.now().getYear()));
            sta.setNumberOfPaidRoom((int) l.stream().filter(DetailBill::getIsPaid).count());
            sta.setNumberOfUnpaidRoom((int) l.stream().filter(db -> !db.getIsPaid()).count());
            sta.setNumberOfFullRoom(iRoomService.getAllRoomByLimit(3).size());
            sta.setNumberOfAvailableRoom(iRoomService.getAllRoomByLimit(2).size());
            sta.setNumberOfEmptyRoom(iRoomService.getAllRoomByLimit(1).size());
            return ResponseEntity.ok(sta);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================HISTORY ROOM===========================
    @GetMapping("/history/all")
    public ResponseEntity<?> getAllHistory() {
        try {
            return ResponseEntity.ok(iHistoryCustomerService.getAllHistoryCustomer());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/history/{customerId}")
    public ResponseEntity<?> getHistoryByCustomerId(@PathVariable Integer customerId) {
        try {
            return ResponseEntity.ok(iHistoryCustomerService.getHistoryByCustomerId(customerId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================SERVICE===========================
    @GetMapping("/service/all")
    public ResponseEntity<?> getAllService() {
        try {
            return ResponseEntity.ok(iServiceService.getAllService());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/service/add")
    @Transactional
    public ResponseEntity<?> saveService(@RequestBody Service service) {
        try {
            iServiceService.saveService(service);
            return ResponseEntity.ok("Thêm dịch vụ thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/service/{serviceId}/update")
    @Transactional
    public ResponseEntity<?> updateService(@PathVariable Integer serviceId, @RequestBody Service service) {
        try {
            iServiceService.updateService(serviceId, service);
            return ResponseEntity.ok("Cập nhật dịch vụ thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/service/{serviceId}/delete")
    @Transactional
    public ResponseEntity<?> deleteServiceByServiceId(@PathVariable int serviceId) {
        try {
            iServiceService.deleteService(serviceId);
            return ResponseEntity.ok("Dịch vụ đã được xóa");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================ROOM SERVICE===========================
    @GetMapping("/roomService/room/{roomId}")
    public ResponseEntity<?> getServiceByRoomId(
        @PathVariable Integer roomId
    ) {
        try {
            return ResponseEntity.ok(iRoomServiceService.getServiceByRoomId(roomId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/roomService/all")
    public ResponseEntity<?> getAllServiceRoomByServiceId() {
        try {
            return ResponseEntity.ok(iRoomServiceService.getAllRoomServiceInUse());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/roomService/{roomId}/update")
    @Transactional
    public ResponseEntity<?> updateRoomService(@PathVariable Integer roomId, @RequestBody List<InfoRoomService> infoRoomService) {
        try {
            iRoomServiceService.updateRoomService(roomId, infoRoomService);
            return ResponseEntity.ok("Cập nhật dịch vụ phòng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================CONTRACT===========================
    @GetMapping("/contract/all")
    public ResponseEntity<?> getAllContract() {
        try {
            return ResponseEntity.ok(iContractService.getAllContract());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PostMapping("/contract/{customerId}/{roomId}/add")
    public ResponseEntity<?> saveContract(@PathVariable Integer customerId,
                                          @PathVariable Integer roomId,
                                          @RequestBody InfoContract infoContract) {
        try {
            iContractService.saveContract(customerId, roomId, infoContract);
            return ResponseEntity.ok("Lưu hợp đồng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PutMapping("/contract/{contractId}/delete")
    @Transactional
    public ResponseEntity<?> deleteContract(@PathVariable Integer contractId) {
        try {
            iContractService.deleteContract(contractId);
            return ResponseEntity.ok("Hủy hợp đồng thành công");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    // doi mat khau
    @PostMapping("/email")
    public ResponseEntity<?> email( @RequestBody String email ){
        try{
            if(iMailService.sendMail(email)){
                return ResponseEntity.ok("Gui email thanh cong");
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Gui khong thanh cong");
            }
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    @PostMapping("/email/identify")
    public ResponseEntity<?> accept( @RequestBody Identify identify){
        try{
            if(iMailService.xacnhan(identify.getEmail(), identify.getIdentify())){
                return ResponseEntity.ok("Xac nhan thanh cong");
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Xac nhan khong thanh cong");
            }
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    @PostMapping("/email/identify/matkhau")
    public ResponseEntity<?> changePassword( @RequestBody ChangePassword password){
        try{
            if(iMailService.doimatkhau(password.getEmail(),password.getPassword())){
                return ResponseEntity.ok("Doi mat khau thanh cong");
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Doi mat khau khong thanh cong");
            }
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
