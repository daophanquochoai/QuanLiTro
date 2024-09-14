package com.CNPM.QLNT.services.Inter;

import com.CNPM.QLNT.model.Room;
import com.CNPM.QLNT.response.RoomRes;

import java.util.List;
import java.util.Optional;

public interface IRoomService {
    List<RoomRes> getAllRoom();
    Optional<Room> getRoomByRoomId(Integer roomId);
    void addRoom(RoomRes roomRes);
    void updateRoom(int roomId,RoomRes roomRes);
    void deleteRoom(int roomId);
    List<RoomRes> getAllRoomByLimit(int type);
    List<Room> getAllRoomWithContract();
    List<RoomRes> getRoomForBillByMonth(int month,int year);
}
