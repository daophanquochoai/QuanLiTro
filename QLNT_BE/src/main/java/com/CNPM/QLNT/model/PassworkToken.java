package com.CNPM.QLNT.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class PassworkToken {
    @Id
    private String email;
    private Boolean status;
    @Column(columnDefinition = "char(4)")
    private String identify;
    private LocalDateTime createTime;
}
