package com.CNPM.QLNT.services.Inter;
import com.CNPM.QLNT.model.RoomService;
import com.CNPM.QLNT.response.InfoRoomService;
import com.CNPM.QLNT.response.InfoService;

import java.time.LocalDate;
import java.util.List;

public interface IRoomService_Service {
    List<InfoService> getServiceByRoomId(Integer roomId);
    void updateRoomService(Integer roomId, List<InfoRoomService> infoRoomService);
    List<RoomService> getServiceOfRoom(Integer roomId);
    List<RoomService> getAllRoomServiceInUse();

}
