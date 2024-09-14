package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.model.RoomType;
import com.CNPM.QLNT.repository.RoomTypeRepo;
import com.CNPM.QLNT.services.Inter.IRoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeServiceService implements IRoomTypeService {
    private final RoomTypeRepo roomTypeRepo;
    @Override
    public void addRoomType(RoomType roomType) {
        List<RoomType> roomTypeList = roomTypeRepo.findAll();

        // Kiểm tra xem roomType đã tồn tại trong danh sách chưa
        boolean isDuplicate = roomTypeList.stream()
                .anyMatch(h -> h.getRoomTypeName().equals(roomType.getRoomTypeName()));

        if (!isDuplicate) {
            roomTypeRepo.save(roomType);
        } else {
            // Nếu roomType đã tồn tại, ném RuntimeException
            throw new RuntimeException("Loại phòng đã tồn tại");
        }
    }
    @Override
    public void deleteRoomType(int roomTypeId) {
        RoomType roomType = getRoomTypeByRoomTypeId(roomTypeId);
        roomTypeRepo.delete(roomType);
    }

    @Override
    public List<RoomType> getAllRoomType() {
        return roomTypeRepo.findAll();
    }
    @Override
    public RoomType getRoomTypeByRoomTypeId(int roomTypeId) {
        return roomTypeRepo.getRoomTypeByRoomTypeId(roomTypeId);
    }

}
