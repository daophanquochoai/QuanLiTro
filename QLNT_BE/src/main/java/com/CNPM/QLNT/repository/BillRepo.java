package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepo extends JpaRepository<Bill, Integer> {
    @Query("select b from Bill b order by b.room.roomId")
    List<Bill> getAllBill();

    @Query("select b from Bill b inner join Contract c on (c.room.roomId = :roomId and c.status = true) " +
        "where b.room.roomId = :roomId " +
        "and (YEAR(c.beginDate) < YEAR(b.beginDate) " +
        "or (MONTH(c.beginDate) <= MONTH(b.beginDate) and YEAR(c.beginDate) = YEAR(b.beginDate) ))")
    List<Bill> getAllBillByRoomId(int roomId);

    @Query("select b from Bill b where b.status = :status and b.room.roomId = :roomId")
    List<Bill> getBillByStatus(boolean status, int roomId);

    @Query("select  b from Bill b where MONTH(b.beginDate)= :month and YEAR(b.beginDate) = :year order by b.room.roomId asc")
    List<Bill> getAllBillByMonthYear(int month, int year);

    @Query("select b from Bill  b where YEAR(b.beginDate) = :year and b.status = true")
    List<Bill> getBillByYear( int year);
    @Query("select  b from Bill b where MONTH(b.beginDate) = :month and YEAR(b.beginDate) = :year and b.room.roomId = :roomId")
    Optional<Bill> getBillByRoomInMonthInYear(Integer roomId, Integer month, Integer year);
    @Query("select  b from Bill b where b.room.roomId = :roomId order by b.beginDate desc")
    List<Bill> getPreviousBillByRoomId(Integer roomId);
}
