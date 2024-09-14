package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepo extends JpaRepository<RoomType, Integer> {
    RoomType getRoomTypeByRoomTypeId(int roomTypeId);
}
