package com.ledgerly.api.config;

import com.ledgerly.api.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
    @Bean UserDetailsService userDetailsService(UserRepository users){
        return email -> users.findByEmailIgnoreCase(email).map(u -> User.withUsername(u.getEmail()).password(u.getPasswordHash()).roles("USER").build()).orElseThrow(() -> new UsernameNotFoundException("Account not found"));
    }
    @Bean DaoAuthenticationProvider authenticationProvider(UserDetailsService details, PasswordEncoder encoder){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(); provider.setUserDetailsService(details); provider.setPasswordEncoder(encoder); return provider;
    }
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception { return configuration.getAuthenticationManager(); }
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, DaoAuthenticationProvider provider) throws Exception {
        CookieCsrfTokenRepository csrf = CookieCsrfTokenRepository.withHttpOnlyFalse();
        http.authenticationProvider(provider).cors(Customizer.withDefaults()).csrf(c -> c.csrfTokenRepository(csrf))
          .authorizeHttpRequests(a -> a.requestMatchers("/api/auth/csrf","/api/auth/register","/api/auth/login","/error").permitAll().requestMatchers(HttpMethod.OPTIONS,"/**").permitAll().anyRequest().authenticated())
          .exceptionHandling(e -> e.authenticationEntryPoint((request,response,ex) -> { response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); response.setContentType("application/json"); response.getWriter().write("{\"message\":\"Please sign in to continue.\"}"); }))
          .logout(l -> l.disable());
        return http.build();
    }
    @Bean CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration config = new CorsConfiguration(); config.setAllowedOrigins(List.of("http://localhost:5173","http://127.0.0.1:5173")); config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); config.setAllowedHeaders(List.of("Content-Type","X-XSRF-TOKEN","X-CSRF-TOKEN")); config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/api/**",config); return source;
    }
}
