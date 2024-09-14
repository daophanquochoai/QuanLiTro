package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.PassworkToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PassworkTokenRepo extends JpaRepository<PassworkToken, String> {
}
