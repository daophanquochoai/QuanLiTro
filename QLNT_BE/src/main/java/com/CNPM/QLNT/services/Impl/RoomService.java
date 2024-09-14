package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.Room;
import com.CNPM.QLNT.repository.ContractRepo;
import com.CNPM.QLNT.repository.HistoryCustomerRepo;
import com.CNPM.QLNT.repository.RoomRepo;
import com.CNPM.QLNT.response.RoomRes;
import com.CNPM.QLNT.services.Inter.IRoomTypeService;
import com.CNPM.QLNT.services.Inter.IRoomService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService implements IRoomService {
    private final IRoomTypeService iRoomTypeService;
    private final RoomRepo roomRepo;
    private final ContractRepo contractRepo;
    private final HistoryCustomerRepo historyCustomerRepo;

    @Override
    public List<RoomRes> getAllRoom() {
        List<Room> list = roomRepo.findAll();
        List<RoomRes> l = list.stream().map(
                r ->
                {
                    RoomRes rm = new RoomRes(r.getRoomId(),
                            r.getLimit(),
                            r.getRoomType().getRoomTypeId(),
                            r.getPrice());
                    return rm;
                }
        ).collect(Collectors.toList());
        return l;
    }

    @Override
    public Optional<Room> getRoomByRoomId(Integer roomId) {
        return Optional.of(roomRepo.findById(roomId).get());
    }

    @Override
    public void addRoom(RoomRes roomRes) {
        boolean isExisted = getAllRoom().stream()
                .anyMatch(r -> r.getRoomId() == roomRes.getRoomId());
        if(isExisted) throw new ResourceNotFoundException("Phòng đã tồn tại");
        try {
            Room room = new Room();
            room.setRoomId(roomRes.getRoomId());
            room.setLimit(roomRes.getLimit());
            room.setPrice(roomRes.getPrice());
            room.setRoomType(iRoomTypeService.getRoomTypeByRoomTypeId(roomRes.getRoomTypeId()));
            log.info("{}", room);
            roomRepo.save(room);
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Dữ liệu phòng bị lỗi");
        }
    }

    @Override
    public void updateRoom(int roomId, RoomRes roomRes) {
        if (getRoomByRoomId(roomId).isEmpty() || roomId == 0) throw new ResourceNotFoundException("Phòng không tồn tại");
        Room r = getRoomByRoomId(roomId).get();
        if (roomRes.getRoomTypeId() != 0) {
            r.setRoomType(iRoomTypeService.getRoomTypeByRoomTypeId(roomRes.getRoomTypeId()));
        }
        if (roomRes.getLimit() >= 0) {
            if (historyCustomerRepo.getCustomersByRoomId(roomId).size() > roomRes.getLimit()) {
                throw new ResourceNotFoundException("Sức chứa bé hơn số người ở hiện tại");
            }
            r.setLimit(roomRes.getLimit());
        }
        if (roomRes.getPrice() != null) {
            r.setPrice(roomRes.getPrice());
        }
        roomRepo.save(r);
    }

    @Override
    @Transactional
    public void deleteRoom(int roomId) {
        try {
            Room Room = getRoomByRoomId(roomId).get();
            Room.setRoomType(null);
            roomRepo.delete(Room);
            roomRepo.flush();
        }catch(DataIntegrityViolationException e){
            throw new ResourceNotFoundException("Không thể xóa phòng do còn dữ liệu liên quan");
        }
    }

    @Override
    public List<RoomRes> getAllRoomByLimit(int type) {
        List<Room> l;
        List<Room> r = roomRepo.findAll();
        if (type == 1) {
            l = r.stream().filter(temp -> historyCustomerRepo.getCustomersByRoomId(temp.getRoomId()).isEmpty()).collect(Collectors.toList());
        } else if (type == 2) {
            l = r.stream().filter(temp -> (historyCustomerRepo.getCustomersByRoomId(temp.getRoomId()).size() < temp.getLimit() && historyCustomerRepo.getCustomersByRoomId(temp.getRoomId()).size() > 0)).collect(Collectors.toList());
        } else {
            l = r.stream().filter(temp -> historyCustomerRepo.getCustomersByRoomId(temp.getRoomId()).size() == temp.getLimit()).collect(Collectors.toList());
        }
        List<RoomRes> list = l.stream().map(
                temp ->
                {
                    RoomRes rm = new RoomRes(temp.getRoomId(),
                            temp.getLimit(),
                            temp.getRoomType().getRoomTypeId(),
                            temp.getPrice());
                    return rm;
                }
        ).collect(Collectors.toList());
        return list;
    }

    @Override
    public List<Room> getAllRoomWithContract() {
        return roomRepo.getRoomWithContract();
    }

    @Override
    public List<RoomRes> getRoomForBillByMonth(int month, int year) {
        List<Room> list = roomRepo.getRoomWithContractByTime(month,year);
        list = list.stream().filter(r -> r.getBill().stream().noneMatch(b -> b.getBeginDate().getMonthValue() == month
                                && b.getBeginDate().getYear() == year)).toList();
        List<RoomRes> l = list.stream().map(
                r ->
                {
                    RoomRes rm = new RoomRes(r.getRoomId(),
                            r.getLimit(),
                            r.getRoomType().getRoomTypeId(),
                            r.getPrice());
                    return rm;
                }
        ).collect(Collectors.toList());
        return l;
    }
}