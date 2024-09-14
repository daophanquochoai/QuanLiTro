package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepo extends JpaRepository<Contract, Integer> {
    @Query("select c from Contract c order by c.room.roomId asc")
    List<Contract> getAllContract();
    @Query("select c from Contract c where c.customer.customerId = :customerId and c.status = true")
    Optional<Contract> getContractByCustomerId(Integer customerId);
    @Query("select  c from Contract c where c.room.roomId = :roomId and c.status = true")
    Optional<Contract> getContractsByRoomId(Integer roomId);
}
