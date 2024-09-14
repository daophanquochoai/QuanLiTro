package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.*;
import com.CNPM.QLNT.repository.CustomerRepo;
import com.CNPM.QLNT.repository.HistoryCustomerRepo;
import com.CNPM.QLNT.repository.RoomRepo;
import com.CNPM.QLNT.repository.UserAuthRepo;
import com.CNPM.QLNT.response.InfoLogin;
import com.CNPM.QLNT.response.InfoUser;
import com.CNPM.QLNT.security.JwtSecurityConfig;
import com.CNPM.QLNT.services.Inter.IContractService;
import com.CNPM.QLNT.services.Inter.ICustomerService;
import com.CNPM.QLNT.services.Inter.IRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService implements ICustomerService {
    private final JwtSecurityConfig security;
    private final IContractService iContractService;
    private final CustomerRepo customerRepo;
    private final HistoryCustomerRepo historyCustomerRepo;
    private final RoomRepo roomRepo;
    private final UserAuthRepo userAuthRepo;
    private final String Email_Regex = "^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";

    private final Pattern pattern = Pattern.compile(Email_Regex);
    private final RequestService requestService;

    @Override
    public List<InfoUser> getAllCustomer() {

        List<Customer> list = customerRepo.findAll();
        List<InfoUser> l = list.stream()
            .filter(c -> c.getUserAuthId().getRole().equals("USER"))
            .map(
                c ->
                {
                    int roomId = 0;
                    if (c.getHistoryCustomer() != null) {
                        Optional<HistoryCustomer> h = c.getHistoryCustomer().stream().filter(t -> (t.getEndDate() == null && t.getCustomer().getCustomerId() == c.getCustomerId())).findFirst();
                        if (h.isPresent()) roomId = h.get().getRoomOld().getRoomId();
                    }
                    InfoUser user = new InfoUser(
                        c.getCustomerId(),
                        c.getFirstName(),
                        c.getLastName(),
                        c.getIdentifier(),
                        c.getDateOfBirth(),
                        c.getSex(),
                        c.getInfoAddress(),
                        c.getPhoneNumber(),
                        c.getEmail(),
                        roomId,
                        c.getUserAuthId() == null ? "Chưa có tài khoản" : c.getUserAuthId().getUsername(),
                        c.getUserAuthId() == null ? "Chưa có tài khoản" : c.getUserAuthId().getPassword()
                    );
                    return user;
                }
            ).collect(Collectors.toList());
        return l;
    }

    @Override
    public Optional<Customer> getCustomer(int customerId) {
        return Optional.of(customerRepo.findById(customerId).get());
    }

    @Override
    public List<InfoUser> getCustomerByRoomId(Integer roomId) {
        List<Customer> list = historyCustomerRepo.getCustomersByRoomId(roomId);
        List<InfoUser> l = list.stream().map(
            c ->
            {
                InfoUser user = new InfoUser(
                    c.getCustomerId(),
                    c.getFirstName(),
                    c.getLastName(),
                    c.getIdentifier(),
                    c.getDateOfBirth(),
                    c.getSex(),
                    c.getInfoAddress(),
                    c.getPhoneNumber(),
                    c.getEmail(),
                    roomId,
                    c.getUserAuthId() == null ? "Chưa có tài khoản" : c.getUserAuthId().getUsername(),
                    c.getUserAuthId() == null ? "Chưa có tài khoản" : c.getUserAuthId().getPassword()
                );
                return user;
            }
        ).collect(Collectors.toList());
        return l;
    }

    @Override
    public Boolean addCustomer(InfoUser info) {
        Customer c = new Customer();
        HistoryCustomer historyCustomer = new HistoryCustomer();
        Room r = roomRepo.findById(info.getRoomId()).get();
        if (roomRepo.findById(info.getRoomId()).isEmpty())
            throw new ResourceNotFoundException("Phòng không tồn tại");
        if (r.getLimit() < historyCustomerRepo.getCustomersByRoomId(r.getRoomId()).size())
            throw new ResourceNotFoundException("Phòng đã đầy");

        List<InfoUser> listAllCustomer = getAllCustomer();
        // Kiểm tra xem đã từng ở chưa (ko tính đang ở) bằng CCCD
        // Nếu chưa từng ở thì kiểm tra thông tin và thêm khách thuê mới
        if (historyCustomerRepo.getPreviousCustomerByIdentifier(info.getIdentifier()).isEmpty()) {
            if (!listAllCustomer.isEmpty()) {
                for (InfoUser cus : listAllCustomer) {
                    if (cus.getIdentifier().equals(info.getIdentifier()))
                        throw new ResourceNotFoundException("Mã CCCD đã tồn tại");
                    if (cus.getPhoneNumber().equals(info.getPhoneNumber()))
                        throw new ResourceNotFoundException("Số điện thoại đã tồn tại");
                    if (cus.getEmail().equals(info.getEmail()))
                        throw new ResourceNotFoundException("Email đã tồn tại");
                }
            }

            //Thêm khách thuê vào bảng history customer
            historyCustomer.setRoomOld(r);
            historyCustomer.setBeginDate(LocalDate.now());

            //Tạo tài khoản cho khách thuê
            UserAuth ua = new UserAuth();
            ua.setUsername(info.getUsername());
            ua.setPassword(new BCryptPasswordEncoder().encode(info.getPassword()));
            ua.setActive(true);
            ua.setRole("USER");
            c.setUserAuthId(ua);

        }
        // Nếu đã từng ở thì chỉ cần cập nhật lại thông tin khách thuê đó
        else {
            getAllCustomer().forEach(cus -> {
                if (!cus.getIdentifier().equals(info.getIdentifier())) {
                    if (cus.getPhoneNumber().equals(info.getPhoneNumber()))
                        throw new ResourceNotFoundException("Số điện thoại đã tồn tại");
                    if (cus.getEmail().equals(info.getEmail()))
                        throw new ResourceNotFoundException("Email đã tồn tại");
                }
            });
            c = customerRepo.getCustomerByIdentifier(info.getIdentifier());
            historyCustomer = historyCustomerRepo.getPreviousCustomerByIdentifier(c.getIdentifier()).get(0);
            historyCustomer.setRoomOld(r);
            historyCustomer.setBeginDate(LocalDate.now());
            historyCustomer.setEndDate(null);

            c.getUserAuthId().setActive(true);
            c.getUserAuthId().setUsername(info.getEmail());
        }

        //Thêm thông tin khách thuê
        c.setFirstName(info.getFirstName());
        c.setLastName(info.getLastName());
        if (info.getIdentifier() == null || info.getIdentifier().length() != 12) {
            throw new ResourceNotFoundException("Mã CCCD không hợp lệ");
        }
        c.setIdentifier(info.getIdentifier());
        if (info.getDateOfBirth() != null) {
            if (info.getDateOfBirth().isAfter(LocalDate.now()))
                throw new ResourceNotFoundException("Ngày sinh không hợp lệ");
            c.setDateOfBirth(info.getDateOfBirth());
        }
        if (info.getSex() != null) {
            c.setSex(info.getSex());
        }
        if (info.getInfoAddress() != null) {
            c.setInfoAddress(info.getInfoAddress());
        }
        if (info.getPhoneNumber() != null) {
            if (info.getPhoneNumber().length() != 10 || info.getPhoneNumber().charAt(0) != '0')
                throw new ResourceNotFoundException("Số điện thoại không hợp lệ");
            c.setPhoneNumber(info.getPhoneNumber());
        }
        if (info.getEmail() != null) {
            Matcher matcher = pattern.matcher(info.getEmail());
            if (!matcher.matches()) throw new ResourceNotFoundException("Email không hợp lệ");
            c.setEmail(info.getEmail());
        }

        Customer customer = customerRepo.save(c);
        historyCustomer.setCustomer(customer);
        historyCustomerRepo.save(historyCustomer);
        return true;
    }

    @Override
    public void updateCustomer(int customerId, InfoUser info) {
        Optional<Customer> C = getCustomer(customerId);
        if (C.isEmpty()) throw new ResourceNotFoundException("Không tìm thấy khách thuê");
        Customer customer = C.get();

        int room = 0;
        if (customer.getHistoryCustomer() != null) {
            room = customer.getHistoryCustomer().stream().filter(t -> t.getEndDate() == null).findFirst().get().getRoomOld().getRoomId();
        }
        Optional<Contract> contract = iContractService.getContractByCustomerId(customerId);
        if (contract.isPresent() && info.getRoomId() != room) {
            if (contract.get().getCustomer().getCustomerId() == customer.getCustomerId()) {
                throw new ResourceNotFoundException("Khách thuê đang là chủ hợp đồng của phòng hiện tại");
            }
        }
        getAllCustomer().forEach(cus -> {
            if (cus.getCustomerId() != customerId) {
                if (cus.getIdentifier().equals(info.getIdentifier()))
                    throw new ResourceNotFoundException("Mã CCCD đã tồn tại");
                if (cus.getPhoneNumber().equals(info.getPhoneNumber()))
                    throw new ResourceNotFoundException("Số điện thoại đã tồn tại");
                if (cus.getEmail().equals(info.getEmail()))
                    throw new ResourceNotFoundException("Email đã tồn tại");
            }
        });
        if (info.getFirstName() != null) {
            customer.setFirstName(info.getFirstName());
        }
        if (info.getLastName() != null) {
            customer.setLastName(info.getLastName());
        }
        if (info.getIdentifier() != null) {
            if (info.getIdentifier().length() != 12) {
                throw new ResourceNotFoundException("Mã CCCD không hợp lệ");
            }
            customer.setIdentifier(info.getIdentifier());
        }
        if (info.getInfoAddress() != null) {
            customer.setInfoAddress(info.getInfoAddress());
        }
        if (info.getDateOfBirth() != null) {
            if (info.getDateOfBirth().isAfter(LocalDate.now()))
                throw new ResourceNotFoundException("Ngày sinh không hợp lệ");
            customer.setDateOfBirth(info.getDateOfBirth());
        }
        if (info.getSex() != null) {
            customer.setSex(info.getSex());
        }
        if (info.getPhoneNumber() != null) {
            if (info.getPhoneNumber().length() != 10 || info.getPhoneNumber().charAt(0) != '0')
                throw new ResourceNotFoundException("Số điện thoại không hợp lệ");
            customer.setPhoneNumber(info.getPhoneNumber());
        }
        if (info.getEmail() != null) {
            Matcher matcher = pattern.matcher(info.getEmail());
            if (!matcher.matches()) throw new ResourceNotFoundException("Email không hợp lệ");
            customer.setEmail(info.getEmail());
            customer.getUserAuthId().setUsername(info.getEmail());
        }

        if (info.getPassword() != null) {
            customer.getUserAuthId().setPassword(new BCryptPasswordEncoder().encode(info.getPassword()));
        }
        if (info.getRoomId() != 0 && info.getRoomId() != room) {
            Optional<HistoryCustomer> h = customer.getHistoryCustomer().stream().filter(t -> t.getEndDate() == null).findFirst();
            if (roomRepo.findById(info.getRoomId()).isEmpty())
                throw new ResourceNotFoundException("Không tìm thấy phòng");
            if (h.isPresent()) {
                h.get().setEndDate(LocalDate.now());
                h.get().setRoomNew(roomRepo.findById(info.getRoomId()).get());
            }
            HistoryCustomer historyCustomer = new HistoryCustomer();
            historyCustomer.setBeginDate(LocalDate.now());
            historyCustomer.setRoomOld(roomRepo.findById(info.getRoomId()).get());
            historyCustomer.setCustomer(customer);
            historyCustomerRepo.save(historyCustomer);
        }
        if (info.getRoomId() == 0) {
            Optional<HistoryCustomer> h = customer.getHistoryCustomer().stream().filter(t -> t.getEndDate() == null).findFirst();
            h.ifPresent(historyCustomer -> historyCustomer.setEndDate(LocalDate.now()));
            customer.getUserAuthId().setActive(false);
        }
        customerRepo.save(customer);
    }

    @Override
    public void deleteCustomer(int customerId) {
        try {
            List<Contract> listCT = iContractService.getAllContract();
            listCT.stream().forEach(c -> {
                if (c.getCustomer().getCustomerId() == customerId && (c.getEndDate().isAfter(LocalDate.now()) || !c.getStatus())) {
                    throw new ResourceNotFoundException("Không thể xóa do tồn tại hợp đồng");
                }
            });
            Customer Customer = getCustomer(customerId).get();
            customerRepo.delete(Customer);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @Override
    public InfoLogin getLogin(String name) {
        return customerRepo.getLogin(name);
    }

    @Override
    public void updatePassword(String password, Integer customerId) {
        Optional<Customer> customer = getCustomer(customerId);
        if (customer.isEmpty()) throw new ResourceNotFoundException("customerId");
        System.out.println(password);
        customer.get().getUserAuthId().setPassword(security.passwordEncoder().encode(password));
        customerRepo.save(customer.get());
    }

}






