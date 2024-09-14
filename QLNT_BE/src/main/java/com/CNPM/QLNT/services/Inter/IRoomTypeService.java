package com.CNPM.QLNT.services.Inter;

import com.CNPM.QLNT.model.RoomType;

import java.util.List;

public interface IRoomTypeService {
    void addRoomType(RoomType homeCate);
    void deleteRoomType(int roomTypeId);
    List<RoomType> getAllRoomType();
    RoomType getRoomTypeByRoomTypeId(int roomTypeId);
}
