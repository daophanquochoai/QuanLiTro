package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.ElectricPrice;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElectricPriceRepo extends JpaRepository<ElectricPrice, Integer> {
    List<ElectricPrice> findAllByOrderByChangedDateDesc();
}
