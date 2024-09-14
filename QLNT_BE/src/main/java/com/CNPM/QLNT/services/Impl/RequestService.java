package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.HistoryCustomer;
import com.CNPM.QLNT.model.Request;
import com.CNPM.QLNT.repository.RequestRepo;
import com.CNPM.QLNT.response.History;
import com.CNPM.QLNT.response.RequestInfo;
import com.CNPM.QLNT.services.Inter.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService implements IRequestService {
    private final RequestRepo requestRepo;

    @Override
    public void addRequest_DonGia(Request re) {
            requestRepo.save(re);
    }

    @Override
    public List<RequestInfo> getAllRequestOfCustomerByStatus(boolean status) {
        List<Request> listRequest = requestRepo.getRequestOfCustomerByStatus(status);
        List<RequestInfo> listRequestInfo = listRequest.stream().map(r ->{
            Integer roomId = -1;
            if( r.getCustomer().getHistoryCustomer() != null ){
                Optional<HistoryCustomer> h = r.getCustomer().getHistoryCustomer().stream().filter(t->
                        (t.getEndDate() == null && t.getCustomer().getCustomerId() == r.getCustomer().getCustomerId())).findFirst();
                if( h.isPresent()) roomId = h.get().getRoomOld().getRoomId();
            }
            RequestInfo requestInfo = new RequestInfo(
                    r.getRequestId(),
                    r.getCreatedDate(),
                    r.getStatus(),
                    r.getMessage(),
                    r.getIsSend(),
                    r.getCustomer().getFirstName(),
                    r.getCustomer().getLastName(),
                    roomId
            );
            return requestInfo;

        }).collect(Collectors.toList());
        return listRequestInfo;
    }

    @Override
    public List<Request> getAllRequestOfCustomer() {
        return requestRepo.getAllRequestOfCustomer();
    }

    @Override
    public void updateRequest(int requestId) {
        Optional<Request> r = requestRepo.findById(requestId);
        if( r.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy yêu cầu");
        r.get().setStatus(true);
        requestRepo.save(r.get());
    }

    @Override
    public void deleteCommunication(int requestId) {
        Optional<Request> r = requestRepo.findById(requestId);
        if( r.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy yêu cầu");
        if(!r.get().getStatus()) throw new ResourceNotFoundException("Vui lòng đáp ứng yêu cầu trước");
        requestRepo.delete(r.get());
    }

    @Override
    public List<Request> getRequestHistoryByIsSend(Integer customerId, boolean isSend) {
        return requestRepo.getAllRequestOfCustomer(customerId,isSend);
    }
}
