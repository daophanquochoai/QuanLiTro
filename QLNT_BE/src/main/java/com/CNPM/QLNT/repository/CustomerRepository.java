package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.Customer;
import com.CNPM.QLNT.response.InfoLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("select new com.CNPM.QLNT.response.InfoLogin(c.userAuthId.role, c.customerId, concat(c.firstName,' ',c.lastName) ) from Customer c where c.userAuthId.username = :name")
    InfoLogin getLogin(String name);
    @Query("select c from Customer c where c.userAuthId.id = :id")
    Customer getInfoCustomer(Integer id);
    Optional<Customer> findByIdentifier(String Identifier);
    Optional<Customer> findByEmail(String email);
}
