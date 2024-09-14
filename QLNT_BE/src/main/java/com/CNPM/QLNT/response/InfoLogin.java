package com.CNPM.QLNT.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InfoLogin {
    private String role;
    private int id;
    private String name;
}
