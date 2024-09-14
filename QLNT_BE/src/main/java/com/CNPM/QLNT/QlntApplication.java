package com.CNPM.QLNT;

import com.CNPM.QLNT.security.JwtSecurityConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;

@SpringBootApplication
@Slf4j
public class QlntApplication implements CommandLineRunner {
	@Autowired
	private JwtSecurityConfig jwtSecurityConfig;
	public static void main(String[] args) {
		SpringApplication.run(QlntApplication.class, args);
	}
	@Override
	public void run(String... args) throws Exception {
		System.out.println( jwtSecurityConfig.passwordEncoder().encode("123"));
	}
}
