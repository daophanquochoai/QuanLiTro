package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.Room;
import com.CNPM.QLNT.model.RoomService;
import com.CNPM.QLNT.model.Service;
import com.CNPM.QLNT.repository.RoomRepo;
import com.CNPM.QLNT.repository.RoomServiceRepo;
import com.CNPM.QLNT.repository.ServiceRepo;
import com.CNPM.QLNT.response.InfoRoomService;
import com.CNPM.QLNT.response.InfoService;
import com.CNPM.QLNT.services.Inter.IRoomService_Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.UnexpectedRollbackException;

import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class RoomService_Service implements IRoomService_Service {
    private final RoomServiceRepo roomServiceRepo;
    private final RoomRepo roomRepo;
    private final ServiceRepo serviceRepo;

    @Override
    public List<InfoService> getServiceByRoomId(Integer roomId) {
        return roomServiceRepo.getAllServiceInUseByRoomId(roomId);
    }


    @Override
    public void updateRoomService(Integer roomId, List<InfoRoomService> infoRoomServiceList) {
        //Lấy ra danh sách dịch vụ phòng đang sử dụng để kiểm tra
        roomServiceRepo.getAllRoomServiceInUseByRoomId(roomId).forEach(roomService -> {
            //Tìm trong đống dịch vụ vừa đăng kí có tồn tại dịch vụ đang đăng kí ko
            Optional<InfoRoomService> irs = infoRoomServiceList.stream()
                    .filter(infoRoomService -> infoRoomService.getServiceId() == roomService.getService().getServiceId()).findFirst();
            //Nếu ko tồn tại nghĩa là dịch vụ đang đăng kí đó đã bị hủy
            if (irs.isEmpty()) {
                roomService.setEndDate(LocalDate.now());
                roomServiceRepo.save(roomService);
            }
        });
        infoRoomServiceList.forEach((infoRoomService) -> {
            try {
                //Kiểm tra phòng đã từng dùng dịch vụ đó chưa trong list dịch vụ vừa đăng kí
                RoomService check = roomServiceRepo
                        .getRoomServiceByRoomIdAndServiceId(infoRoomService.getRoomId(), infoRoomService.getServiceId());
                //Nếu có thì cập nhật lại thông tin dịch vụ phòng đó
                if (check != null) {
                    //Nếu đã từng đăng kí thì đăng kí lại
                    if (check.getEndDate() != null) {
                        check.setBeginDate(LocalDate.now());
                        check.setEndDate(null);
                    }
                    //Không thì cập nhật lại thông tin dịch vụ phòng đó đang dùng
                    check.setQuantity(infoRoomService.getQuantity());
                    roomServiceRepo.save(check);
                }
                //Nếu không thì đăng kí dịch vụ mới cho phòng
                else {
                    RoomService roomService = new RoomService();
                    roomService.setBeginDate(LocalDate.now());
                    roomService.setEndDate(null);
                    if (infoRoomService.getQuantity() < 0)
                        throw new ResourceNotFoundException("Số lượng phải lớn hơn 0");
                    roomService.setQuantity(infoRoomService.getQuantity());
                    if (serviceRepo.findById(infoRoomService.getServiceId()).isEmpty())
                        throw new ResourceNotFoundException("Không tìm thấy dịch vụ");
                    if (roomRepo.findById(infoRoomService.getRoomId()).isEmpty())
                        throw new ResourceNotFoundException("Không tìm thấy phòng");
                    Room room = roomRepo.findById(infoRoomService.getRoomId()).get();
                    Service service = serviceRepo.findById(infoRoomService.getServiceId()).get();
                    roomService.setService(service);
                    roomService.setRoom(room);
                    roomServiceRepo.save(roomService);
                }
            } catch (Exception ex) {
                throw new ResourceNotFoundException(ex.getMessage());
            }
        });
    }

    @Override
    public List<RoomService> getServiceOfRoom(Integer roomId) {
        Optional<Room> room = roomRepo.findById(roomId);
        if (room.isEmpty()) throw new ResourceNotFoundException("roomId");
        return room.get().getRoomService();
    }

    @Override
    public List<RoomService> getAllRoomServiceInUse() {
        return roomServiceRepo.getAllRoomServiceInUse();
    }
}
