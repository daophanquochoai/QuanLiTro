package com.CNPM.QLNT.security;

import com.CNPM.QLNT.response.InfoLogin;

public record JwtTokenResponse<T>(String token, T ThongTin) {}


