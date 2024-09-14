package com.CNPM.QLNT.services.Impl;

import com.CNPM.QLNT.exception.ResourceNotFoundException;
import com.CNPM.QLNT.model.Customer;
import com.CNPM.QLNT.model.PassworkToken;
import com.CNPM.QLNT.model.UserAuth;
import com.CNPM.QLNT.repository.CustomerRepository;
import com.CNPM.QLNT.repository.PassworkTokenRepo;
import com.CNPM.QLNT.repository.UserAuthRepo;
import com.CNPM.QLNT.security.JwtSecurityConfig;
import com.CNPM.QLNT.services.Inter.IMailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService implements IMailService {
    private final JavaMailSender javaMailSender;
    private final CustomerRepository customerRepo;
    private final PassworkTokenRepo passworkTokenRepo;
    private final JwtSecurityConfig jwtSecurityConfig;
    private final UserAuthRepo userAuthRepo;

    @Value("${spring.mail.username}")
    private String emailSender;
    @Value("${email.admin}")
    private String emailAdmin;
    private final String CHARACTERS = "0123456789";

    @Override
    public Boolean sendMail(String emailReceiver) {
        Boolean check = false;
        Optional<Customer> customer = customerRepo.findByEmail(emailReceiver);
        if( customer.isPresent()) check = true;
        if( emailReceiver.equals(emailAdmin)) check = true;
        if( !check ){
            // khong co email giong
            return false;
        }
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for( int i  = 0 ; i < 4 ; i++ ){
            int randomNumber = random.nextInt(CHARACTERS.length());
            char ramdomChar = CHARACTERS.charAt(randomNumber);
            sb.append(ramdomChar);
        }
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(emailSender);
            helper.setTo(emailReceiver);
            helper.setSubject("Khôi phục mật khẩu");
            helper.setText(
                    "<!DOCTYPE html>\n" +
                            "<html>\n" +
                            "<html lang=\"en\">\n" +
                            "<head>\n" +
                            "    <meta charset=\"UTF-8\">\n" +
                            "    <title>Change Account</title>\n" +
                            "    <link\n" +
                            "    rel=\"stylesheet\"\n" +
                            "    href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css\"\n" +
                            "    integrity=\"sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==\"\n" +
                            "    crossorigin=\"anonymous\"\n" +
                            "    referrerpolicy=\"no-referrer\"\n" +
                            "    />\n" +
                            "    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\" crossorigin=\"anonymous\">\n" +
                            "</head>\n" +
                            "<body class=\"d-flex justify-content-center align-items-center w-100\">\n" +
                            "\n" +
                            "<section class=\"container-fluid d-flex justify-content-center align-items-center w-100\" style=\"height:200px\">\n" +
                            "        <div>\n" +
                            "            <div style=\"font-size: 24px;\" class=\"mb-4 mt-4\">Quản lí nhà trọ</div>\n" +
                            "            <div style=\"background-color: gray; color: white; text-align: center; font-size: 30px;\" class=\"mt-3 mb-3\">" +sb.toString() + "</div>\n" +
                            "        </div>\n" +
                            "</section>\n" +
                            "\n" +
                            "<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM\" crossorigin=\"anonymous\"></script>\n" +
                            "</body>\n" +
                            "</html>"
                    , true);

            javaMailSender.send(message);
            PassworkToken passworkToken = new PassworkToken();
            passworkToken.setIdentify(sb.toString());
            passworkToken.setEmail(emailReceiver);
            passworkToken.setStatus(false);
            passworkToken.setCreateTime(LocalDateTime.now());
            passworkTokenRepo.save(passworkToken);
            return true;
        }catch (Exception ex){
            return false;
        }
    }

    @Override
    public Boolean xacnhan(String emailReceiver, String identify) {
        Optional<PassworkToken> passworkToken = passworkTokenRepo.findById(emailReceiver);
        if( passworkToken.isEmpty()) return false;
        if( passworkToken.get().getIdentify().equals(identify) && passworkToken.get().getCreateTime().plusMinutes(1).isAfter(LocalDateTime.now())){
            passworkToken.get().setStatus(true);
            passworkTokenRepo.save(passworkToken.get());
            return true;
        }
        return false;
    }

    @Override
    public Boolean doimatkhau(String emailReceiver, String password) {
       try{
           Optional<PassworkToken> passworkToken = passworkTokenRepo.findById(emailReceiver);
           if( passworkToken.isEmpty() || passworkToken.get().getCreateTime().plusMinutes(60).isBefore(LocalDateTime.now())) return false;
           if( !passworkToken.get().getStatus()) return false;
           Optional<Customer> customer = customerRepo.findByEmail(emailReceiver);
           if( emailReceiver.equals(emailAdmin) ){
               Optional<UserAuth> ua = userAuthRepo.findByAdmin();
               if(ua.isEmpty()) return false;
               ua.get().setPassword(jwtSecurityConfig.passwordEncoder().encode(password));
               userAuthRepo.save(ua.get());
               return true;
           }
           else{
               if( customer.isEmpty()) return false;
               customer.get().getUserAuthId().setPassword(jwtSecurityConfig.passwordEncoder().encode(password));
               customerRepo.save(customer.get());
               passworkToken.get().setStatus(false);
               passworkTokenRepo.save(passworkToken.get());
               return true;
           }
       }catch (Exception ex){
           log.warn("{}", ex.getMessage());
           return false;
       }
    }
}
