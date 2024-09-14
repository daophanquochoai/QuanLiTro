package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.Customer;
import com.CNPM.QLNT.model.HistoryCustomer;
import com.CNPM.QLNT.repository.HistoryCustomerRepo;
import com.CNPM.QLNT.response.History;
import com.CNPM.QLNT.services.Inter.IHistoryCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryCustomerService implements IHistoryCustomerService {
    private final HistoryCustomerRepo historyCustomerRepo;
    @Override
    public List<History> getAllHistoryCustomer() {
        List<History> list = historyCustomerRepo.findAll().stream().map( h ->{
            History history = new History();
            if( h.getBeginDate() != null){
                history.setBeginDate(h.getBeginDate());
            }else{
                throw new ResourceNotFoundException("Ngày bắt đầu không hợp lệ");
            }
            if(h.getEndDate() == null){
                history.setEndDate(null);
                if( h.getRoomNew() != null){
                    throw new ResourceNotFoundException("Ngày kết thúc không hợp lệ");
                }else{
                    history.setRoomNew(null);
                }
            }else {
                if( h.getEndDate().isAfter(h.getBeginDate())){
                    history.setEndDate(h.getEndDate());
                }else{
                    throw new ResourceNotFoundException("Ngày kết thúc không hợp lệ");
                }
            }
            if( h.getRoomOld() != null){
                history.setRoomOld(h.getRoomOld());
            }else throw new ResourceNotFoundException("Phòng không hợp lệ");
            return history;
        }).collect(Collectors.toList());
        return list;
    }
    @Override
    public List<HistoryCustomer> getHistoryByCustomerId(Integer customerId) {
        return historyCustomerRepo.getHistoryByCustomerId(customerId);
    }

    @Override
    public List<Customer> getAllCustomerByRoomId(Integer roomId) {
        return historyCustomerRepo.getCustomersByRoomId(roomId);
    }
}
