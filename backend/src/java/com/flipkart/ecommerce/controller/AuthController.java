package com.flipkart.ecommerce.controller;

import com.flipkart.ecommerce.dto.AuthRequest;
import com.flipkart.ecommerce.dto.AuthResponse;
import com.flipkart.ecommerce.dto.RegisterRequest;
import com.flipkart.ecommerce.model.User;
import com.flipkart.ecommerce.repository.UserRepository;
import com.flipkart.ecommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole("USER");
        
        userRepository.save(user);
        
        String jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
            user.getUsername(), user.getPassword(), new java.util.ArrayList<>()
        ));
        
        return ResponseEntity.ok(AuthResponse.builder()
            .token(jwtToken)
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .build());
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        var user = userRepository.findByUsername(request.getUsername())
            .orElseThrow();
        
        var jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
            user.getUsername(), user.getPassword(), new java.util.ArrayList<>()
        ));
        
        return ResponseEntity.ok(AuthResponse.builder()
            .token(jwtToken)
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .build());
    }
}
