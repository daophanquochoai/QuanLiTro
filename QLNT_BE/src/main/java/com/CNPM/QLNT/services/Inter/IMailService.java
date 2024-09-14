package com.CNPM.QLNT.services.Inter;

public interface IMailService {
    public Boolean sendMail(String emailReceiver);
    public Boolean xacnhan(String emailReceiver, String identify);
    public Boolean doimatkhau(String emailReceiver, String password);
}
