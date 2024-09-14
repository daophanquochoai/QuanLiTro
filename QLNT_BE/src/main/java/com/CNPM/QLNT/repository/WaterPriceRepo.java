package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.WaterPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WaterPriceRepo extends JpaRepository<WaterPrice, Integer> {
    List<WaterPrice> findAllByOrderByChangedDateDesc();
}
