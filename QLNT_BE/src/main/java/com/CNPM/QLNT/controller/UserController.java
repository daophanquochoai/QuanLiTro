package com.CNPM.QLNT.controller;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.*;
import com.CNPM.QLNT.response.InfoContract;
import com.CNPM.QLNT.response.InfoRoom;
import com.CNPM.QLNT.response.InfoUser;
import com.CNPM.QLNT.security.JwtSecurityConfig;
import com.CNPM.QLNT.services.Inter.*;
import com.CNPM.QLNT.services.Impl.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final RoomService roomService;
    private final ICustomerService iCustomerService;
    private final IPriceService iPriceService;
    private final IBillService iBillService;
    private final IRequestService  iRequestService;
    private final IContractService iContractService;
    private final IHistoryCustomerService iHistoryCustomerService;
    private final JwtSecurityConfig jwtSecurityConfig;
    private final IRoomService_Service iRoomServiceService;

    //===========================ROOM===========================
    @GetMapping("/room/{roomId}")
    public ResponseEntity<InfoRoom> getRoomByRoomId(@PathVariable int roomId){
        Optional<Room> theRoom =roomService.getRoomByRoomId(roomId);
        if( theRoom.isEmpty() ){
            throw new ResourceNotFoundException("Not Found Room");
        }
        Optional<Contract> contract = iContractService.getContractByRoomId(theRoom.get().getRoomId());
        InfoRoom infoRoom = new InfoRoom();
        infoRoom.setRoom(theRoom.get());
        if( contract.isEmpty() ) infoRoom.setContract(null);
        else infoRoom.setContract(contract.get());
        return ResponseEntity.ok(infoRoom);
    }

    //===========================CUSTOMER===========================
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerByCustomerId(@PathVariable Integer customerId){
       try{
           Optional<Customer> theCustomer = iCustomerService.getCustomer(customerId);
           if(theCustomer.isEmpty() ){
               throw new ResourceNotFoundException("Not Found Customer");
           }
           Customer Customer = theCustomer.get();
//           System.out.println("==================================");
//           log.info("{}",Customer.getHistoryCustomer().stream().filter(t->t.getEndDate()==null).findFirst().get().getRoomOld().getId());
//           System.out.println("==================================");
        InfoUser user = new InfoUser(
                Customer.getCustomerId(),
                Customer.getFirstName(),
                Customer.getLastName(),
                Customer.getIdentifier(),
                Customer.getDateOfBirth(),
                Customer.getSex(),
                Customer.getInfoAddress(),
                Customer.getPhoneNumber(),
                Customer.getEmail(),
                Customer.getHistoryCustomer().isEmpty() ? -1 : Customer.getHistoryCustomer().stream().filter(t->t.getEndDate()==null).findFirst().get().getRoomOld().getRoomId(),
                Customer.getUserAuthId() == null ? "Chưa có tài khoản" : Customer.getUserAuthId().getUsername(),
                Customer.getUserAuthId() == null ? "Chưa có tài khoản" : Customer.getUserAuthId().getPassword());
           return ResponseEntity.ok(user);
       }catch (Exception ex){
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
       }
    }

    @GetMapping("/customer/getAll")
    public ResponseEntity<?> getAllCustomer(){
        try{
            return ResponseEntity.ok(iCustomerService.getAllCustomer());
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    // xem thong nguoi cua tat cả nguoi chung phong
    @GetMapping("/customer/room/{roomId}")
    public ResponseEntity<?> getAllCustomerByRoomId(@PathVariable Integer roomId){
        try {
            return ResponseEntity.ok(iHistoryCustomerService.getAllCustomerByRoomId(roomId));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //cap nhat mat khau
    @PostMapping("update/password/{customerId}")
    public ResponseEntity<?> updatePassword(@RequestBody String password,
                                            @PathVariable Integer customerId){
        try {
            iCustomerService.updatePassword(password,customerId);
            return ResponseEntity.ok("Success");
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================PRICE QUOTATION===========================
    @GetMapping("/price/water/all")
    public ResponseEntity<List<?>> getAllWaterPrice(){
        return ResponseEntity.ok(iPriceService.getAllWaterPrice());
    }
    @GetMapping("/price/electric/all")
    public ResponseEntity<List<?>> getAllElectricPrice(){
        return ResponseEntity.ok(iPriceService.getAllElectricPrice());
    }

    //===========================BILL===========================
    @GetMapping("/bill/{roomId}")
    public ResponseEntity<?>  getAllBillByRoomId(@PathVariable int roomId){
        try {
            return ResponseEntity.ok(iBillService.getAllBillByRoomId(roomId));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // xem hoa don theo thang, theo nam
    @GetMapping("/bill/{roomId}/{month}/{year}")
    public ResponseEntity<?> getBillByRoomId(
            @PathVariable Integer roomId,
            @PathVariable Integer month,
            @PathVariable Integer year
    ){
        try{
            if( month > 12 || month <= 0) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("month");
            if( year > LocalDate.now().getYear() || year < 0 ) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("year");
            return ResponseEntity.ok(iBillService.getBillByRoomInMonthInYear(roomId,month,year));
        }catch ( Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //6 Tra cuu hoa don dong chua
    @GetMapping("/bill/{roomId}/{status}")
    public ResponseEntity<?> getAllBillInRoomByStatus(@PathVariable int roomId, @PathVariable boolean status){
        try {
            return ResponseEntity.ok(iBillService.getAllBillByStatus(roomId,status));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    //===========================REQUEST===========================
    //7 . Nhan yeu cau tu chu tro

    @GetMapping("request/history/{customerId}/{isSend}")
    public ResponseEntity<?> getMyRequestHistory(
            @PathVariable Integer customerId,
            @PathVariable boolean isSend){
        try{
            return ResponseEntity.ok(iRequestService.getRequestHistoryByIsSend(customerId,isSend));
        }
        catch (Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    // 8. Gui yeu cau den chu tro
    @PostMapping("/request/{customerId}/add")
//    @Transactional
    public ResponseEntity<?> addNotice(@PathVariable int customerId, @RequestBody String mess){
        try{
            Optional<Customer> customers = iCustomerService.getCustomer(customerId);
            if( customers.isEmpty()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Not found Customer");
            Request request = new Request();
            request.setCustomer(customers.get());
            request.setCreatedDate(LocalDateTime.now());
            request.setStatus(false);
            request.setMessage(mess);
            request.setIsSend(true);
            iRequestService.addRequest_DonGia(request);
            return ResponseEntity.ok("Them thanh cong");
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    //===========================CONTRACT===========================
    //9. Xem hop dong cua minh
    @GetMapping("/contract/{customerId}")
    public ResponseEntity<?> getContract(@PathVariable Integer customerId){
        try{
            Optional<Contract> contract = iContractService.getContractByCustomerId(customerId);
            if (contract.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hợp đồng");
            Contract c = contract.get();
            InfoContract ic = new InfoContract();
            ic.setBeginDate(c.getBeginDate());
            ic.setCreatedDate(c.getCreatedDate());
            ic.setEndDate(c.getEndDate());
            ic.setStatus(c.getStatus());
            ic.setRoomId(c.getRoom().getRoomId());
            ic.setCustomerId(c.getCustomer().getCustomerId());
            return ResponseEntity.ok(ic);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/contract/room/{roomId}")
    public ResponseEntity<?> getContractByRoomId(@PathVariable Integer roomId){
        try{
            Optional<Contract> contract = iContractService.getContractByRoomId(roomId);
            if (contract.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy hợp đồng");
            Contract c = contract.get();
            InfoContract ic = new InfoContract();
            ic.setBeginDate(c.getBeginDate());
            ic.setCreatedDate(c.getCreatedDate());
            ic.setEndDate(c.getEndDate());
            ic.setStatus(c.getStatus());
            ic.setRoomId(c.getRoom().getRoomId());
            ic.setCustomerId(c.getCustomer().getCustomerId());
            return ResponseEntity.ok(ic);
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    //===========================SERVICE============================
    // Xem service phong do dang ki
    @GetMapping("/service/{roomId}")
    public ResponseEntity<?> getServiceOfRoom( @PathVariable Integer roomId){
        try{
            return ResponseEntity.ok(iRoomServiceService.getServiceOfRoom(roomId));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
