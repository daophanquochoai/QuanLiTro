package com.CNPM.QLNT.response;

import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class InfoUser {
    private int customerId;
    private String firstName;
    private String lastName;
    private String identifier;
    private LocalDate dateOfBirth;
    private Boolean sex;
    private String infoAddress;
    private String phoneNumber;
    private String email;
    private int roomId;
    private String username;
    private String password;

}
