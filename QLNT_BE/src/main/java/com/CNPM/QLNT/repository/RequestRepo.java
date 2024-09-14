package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RequestRepo extends JpaRepository<Request, Integer> {
    @Query("select r from Request r where r.isSend = true and r.status = :status")
    List<Request> getRequestOfCustomerByStatus(boolean status);
    @Query("select r from Request r where r.isSend = true")
    List<Request> getAllRequestOfCustomer();
    @Query("select r from Request r where r.isSend = :isSend and (r.customer is null or r.customer.customerId = :customerId) order by r.createdDate desc")
    List<Request> getAllRequestOfCustomer(Integer customerId,boolean isSend);
}
