package com.CNPM.QLNT.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;
import java.io.FileOutputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.UUID;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class JwtSecurityConfig{

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .authorizeHttpRequests(auth -> auth
                	.requestMatchers("/authenticate", "/swagger-ui/**", "/admin/email/**").permitAll()
                        .requestMatchers("/user/**", "/admin/customer/**").hasAnyAuthority("SCOPE_USER","SCOPE_ADMIN")
                        .requestMatchers("/admin/**").hasAuthority("SCOPE_ADMIN")
                    .anyRequest().authenticated())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.
                	sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
                .httpBasic(
                        Customizer.withDefaults())
                .headers(header -> header.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)) // Starting from SB 3.1.x using Lambda DSL
                .build();
    }

    @Bean
    public JdbcUserDetailsManager jdbcUserDetailsManager(DataSource dataSource) {
        JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);
        jdbcUserDetailsManager.setUsersByUsernameQuery(
                "SELECT user_name, password, active FROM user_auth WHERE user_name = ?"
        );
        jdbcUserDetailsManager.setAuthoritiesByUsernameQuery(
                "SELECT user_name, role FROM user_auth WHERE user_name = ?"
        );
        return jdbcUserDetailsManager;
    }

    @Bean
    public AuthenticationManager authenticationManager(JdbcUserDetailsManager jdbcUserDetailsManager) {
            var authenticationProvider = new DaoAuthenticationProvider();
            authenticationProvider.setUserDetailsService(jdbcUserDetailsManager);
            authenticationProvider.setPasswordEncoder(passwordEncoder());
            return new ProviderManager(authenticationProvider);
    }
    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        JWKSet jwkSet = new JWKSet(rsaKey());

        return (((jwkSelector, securityContext) 
                        -> jwkSelector.select(jwkSet)));
    }

    @Bean
    JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    JwtDecoder jwtDecoder() throws JOSEException {
        return NimbusJwtDecoder
                .withPublicKey(rsaKey().toRSAPublicKey())
                .build();
    }
    // ma hoa va giai ma RSA
    @Bean
    public RSAKey rsaKey() {
        KeyPair keyPair = keyPair();
        
        return new RSAKey
                .Builder((RSAPublicKey) keyPair.getPublic())
                .privateKey((RSAPrivateKey) keyPair.getPrivate())
                .keyID(UUID.randomUUID().toString())
                .build();
    }
    // tao khoa rsa
    @Bean
    public KeyPair keyPair() {
        try {
            var keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            return keyPairGenerator.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to generate an RSA Key Pair", e);
        }
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Password encoder, để Spring Security sử dụng mã hóa mật khẩu người dùng
        return new BCryptPasswordEncoder();
    }

}


