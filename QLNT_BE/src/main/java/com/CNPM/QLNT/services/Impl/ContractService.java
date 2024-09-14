package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.*;
import com.CNPM.QLNT.repository.*;
import com.CNPM.QLNT.response.InfoContract;
import com.CNPM.QLNT.services.Inter.IContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContractService implements IContractService {
    private final ContractRepo contractRepo;
    private final CustomerRepo customerRepo;
    private final RoomRepo roomRepo;
    private final RoomServiceRepo roomServiceRepo;
    private final BillRepo billRepo;
    private final HistoryCustomerRepo historyCustomerRepo;
    private final UserAuthRepo userAuthRepo;

    @Override
    public List<Contract> getAllContract() {
        List<Contract> listAllContract = contractRepo.getAllContract();
        // Lấy ra các hợp đồng đã hết hạn để thay đổi trạng thái hợp đồng và thông tin người ở, dịch vụ
        List<Contract> listAllContractExpired = listAllContract.stream()
                .filter(c -> c.getEndDate().isBefore(LocalDate.now()) && c.getStatus()).toList();
        listAllContractExpired.forEach(c -> {
            c.setStatus(false);
            historyCustomerRepo.getHistoryCustomerByRoomId(c.getRoom().getRoomId()).forEach(h -> {
                h.setEndDate(c.getEndDate());
                historyCustomerRepo.save(h);
                UserAuth ua = userAuthRepo.findByUserAuthId(h.getCustomer().getUserAuthId().getId()).get();
                ua.setActive(false);
                userAuthRepo.save(ua);
            });
            roomServiceRepo.getAllRoomServiceInUseByRoomId(c.getRoom().getRoomId()).forEach(rs -> {
                rs.setEndDate(c.getEndDate());
                roomServiceRepo.save(rs);
            });
            contractRepo.save(c);
        });

        return listAllContract;
    }

    @Override
    public Optional<Contract> getContractByCustomerId(Integer customerId) {
        log.info("{}",contractRepo.getContractByCustomerId(customerId));
        return contractRepo.getContractByCustomerId(customerId);
    }

    @Override
    public void saveContract(Integer customerId, Integer roomId, InfoContract infoContract) {
        Optional<Customer> customer = customerRepo.findById(customerId);
        if( customer.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy khách thuê");
        Optional<Room> room = roomRepo.findById(roomId);
        if( room.isEmpty() ) throw new ResourceNotFoundException("Không tìm thấy phòng");
        Contract contract = new Contract();
        if( infoContract.getBeginDate() == null ) throw new ResourceNotFoundException("Ngày bắt đầu không hợp lệ");
        if( infoContract.getCreatedDate() == null ) throw new ResourceNotFoundException("Ngày tạo không hợp lệ");
        if( infoContract.getEndDate() == null ) throw new ResourceNotFoundException("Ngày kết thúc không hợp lệ");
        if( infoContract.getBeginDate().isBefore(infoContract.getCreatedDate())) throw new ResourceNotFoundException("Ngày bắt đầu không hợp lệ");
        if( infoContract.getEndDate().isBefore(infoContract.getBeginDate())) throw new ResourceNotFoundException("Ngày kết thúc không hợp lệ");
        if( contractRepo.getContractByCustomerId(customerId).isPresent()) throw new ResourceNotFoundException("Không tìm thấy khách thuê");
        if( room.get().getLimit() < historyCustomerRepo.getCustomersByRoomId(room.get().getRoomId()).size()) throw new ResourceNotFoundException("Phòng đã đầy");

        // tao hop dong
        contract.setCustomer(customer.get());
        contract.setEndDate(infoContract.getEndDate());
        contract.setCreatedDate(infoContract.getCreatedDate());
        contract.setBeginDate(infoContract.getBeginDate());
        contract.setRoom(room.get());
        contract.setStatus(true);

        contractRepo.save(contract);
    }

    @Override
    public void deleteContract(Integer contractId){
        Optional<Contract> contract = contractRepo.findById(contractId);
        if (contract.isPresent()){
            List<Bill> listBill = billRepo.getAllBillByRoomId(contract.get().getRoom().getRoomId());
            if (listBill.stream().anyMatch(b-> !b.getStatus()))
                throw new ResourceNotFoundException("Không thể hủy hợp đồng do phòng có hóa đơn chưa thanh toán");
            contract.get().setStatus(false);
            contractRepo.save(contract.get());
            historyCustomerRepo.getHistoryCustomerByRoomId(contract.get().getRoom().getRoomId()).forEach(h -> {
                h.setEndDate(LocalDate.now());
                historyCustomerRepo.save(h);
                UserAuth ua = userAuthRepo.findByUserAuthId(h.getCustomer().getUserAuthId().getId()).get();
                ua.setActive(false);
                userAuthRepo.save(ua);
            });
            roomServiceRepo.getAllRoomServiceInUseByRoomId(contract.get().getRoom().getRoomId()).forEach(rs -> {
                rs.setEndDate(contract.get().getEndDate());
                roomServiceRepo.save(rs);
            });
        }
    }

    @Override
    public Optional<Contract> getContractByRoomId(Integer roomId) {
        return contractRepo.getContractsByRoomId(roomId);
    }
}
