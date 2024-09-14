package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.RoomService;
import com.CNPM.QLNT.response.InfoService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomServiceRepo extends JpaRepository<RoomService, Integer> {

    @Query("select new com.CNPM.QLNT.response.InfoService(r.service.serviceId,r.service.serviceName, r.service.price, r.quantity) " +
        "from RoomService r where r.room.roomId = :roomId " +
        "and (YEAR(r.beginDate) < :year or (MONTH(r.beginDate) <= :month and YEAR(r.beginDate) = :year ))" +
        "and ((YEAR(r.endDate) > :year) or ((MONTH(r.endDate) >= :month and YEAR(r.endDate) = :year)) " +
        "or r.endDate is null )")
    List<InfoService> getAllServiceByRoomIdMonthYear(Integer roomId, Integer month, Integer year);
    @Query("select new com.CNPM.QLNT.response.InfoService(r.service.serviceId,r.service.serviceName, r.service.price, r.quantity) " +
            "from RoomService r where r.room.roomId = :roomId and r.endDate is null ")
    List<InfoService> getAllServiceInUseByRoomId(Integer roomId);
    @Query ("select rs from RoomService rs where rs.endDate is null")
    List<RoomService> getAllRoomServiceInUse ();
    @Query ("select rs from RoomService rs where rs.endDate is null and rs.room.roomId = :roomId")
    List<RoomService> getAllRoomServiceInUseByRoomId (Integer roomId);
    @Query ("select rs from RoomService rs where rs.room.roomId = :roomId and rs.service.serviceId = :serviceId")
    RoomService getRoomServiceByRoomIdAndServiceId (Integer roomId,Integer serviceId);

}
