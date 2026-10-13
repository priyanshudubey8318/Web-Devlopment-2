package com.ledgerly.api.controller;

import com.ledgerly.api.dto.ApiDtos.*;
import com.ledgerly.api.model.AppUser;
import com.ledgerly.api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder; private final AuthenticationManager authManager;
    public AuthController(UserRepository users,PasswordEncoder encoder,AuthenticationManager authManager){this.users=users;this.encoder=encoder;this.authManager=authManager;}
    @GetMapping("/csrf") public CsrfToken csrf(CsrfToken token){ return token; }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request,HttpServletRequest httpRequest){
        String email=request.email().trim().toLowerCase(Locale.ROOT);
        if(users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT,"An account with this email already exists.");
        AppUser user=users.save(new AppUser(request.name().trim(),email,encoder.encode(request.password())));
        authenticate(email,request.password(),httpRequest); return response(user);
    }
    @PostMapping("/login") public UserResponse login(@Valid @RequestBody LoginRequest request,HttpServletRequest httpRequest){
        String email=request.email().trim().toLowerCase(Locale.ROOT); authenticate(email,request.password(),httpRequest);
        return users.findByEmailIgnoreCase(email).map(AuthController::response).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password."));
    }
    @GetMapping("/me") public UserResponse me(Authentication authentication){return users.findByEmailIgnoreCase(authentication.getName()).map(AuthController::response).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Account not found."));}
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT) public void logout(HttpServletRequest request){SecurityContextHolder.clearContext();HttpSession session=request.getSession(false);if(session!=null)session.invalidate();}
    private void authenticate(String email,String password,HttpServletRequest request){
        Authentication auth=authManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));
        HttpSession session=request.getSession(true);
        request.changeSessionId();
        SecurityContext context=SecurityContextHolder.createEmptyContext();context.setAuthentication(auth);SecurityContextHolder.setContext(context);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,context);
    }
    private static UserResponse response(AppUser u){return new UserResponse(u.getId(),u.getName(),u.getEmail());}
}
