package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.Customer;
import com.CNPM.QLNT.model.HistoryCustomer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface HistoryCustomerRepo extends JpaRepository<HistoryCustomer, Integer> {

    @Query("select h from HistoryCustomer h where h.roomOld.roomId = :roomId and h.endDate is null and h.roomNew.roomId is null")
    List<HistoryCustomer> getHistoryCustomerByRoomId(Integer roomId);
    @Query("select h.customer from HistoryCustomer h where h.roomOld.roomId = :roomId and h.endDate is null and h.roomNew.roomId is null")
    List<Customer> getCustomersByRoomId(Integer roomId);
    @Query("select h from HistoryCustomer h where h.customer.customerId = :customerId order by h.historyCustomerId desc ")
    List<HistoryCustomer> getHistoryByCustomerId(Integer customerId);
    @Query("select h from HistoryCustomer h where h.customer.identifier = :identifier " +
        "and h.endDate is not null order by h.historyCustomerId desc")
    List<HistoryCustomer> getPreviousCustomerByIdentifier(String identifier);
}
