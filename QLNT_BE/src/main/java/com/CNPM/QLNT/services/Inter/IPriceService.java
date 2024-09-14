package com.CNPM.QLNT.services.Inter;


import com.CNPM.QLNT.model.ElectricPrice;
import com.CNPM.QLNT.model.WaterPrice;
import com.CNPM.QLNT.response.PriceQuotation;

import java.util.List;

public interface IPriceService {
    List<ElectricPrice> getAllElectricPrice();
    List<WaterPrice> getAllWaterPrice();
    void saveElectricPrice(ElectricPrice e);
    void saveWaterPrice(WaterPrice w);
    PriceQuotation getPriceNow();
}
