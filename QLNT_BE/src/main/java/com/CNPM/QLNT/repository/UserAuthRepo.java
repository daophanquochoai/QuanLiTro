package com.CNPM.QLNT.repository;

import com.CNPM.QLNT.model.UserAuth;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserAuthRepo extends JpaRepository<UserAuth, Integer> {
    Optional<UserAuth> findByUsername(String username);
    @Query("select u from UserAuth u where u.id = :userAuthId")
    Optional<UserAuth> findByUserAuthId(Integer userAuthId);
    @Query("select u from UserAuth u where u.role = 'ADMIN'")
    Optional<UserAuth> findByAdmin();
}
