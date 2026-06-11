package com.interviewace.controller;

import com.interviewace.dto.AuthResponse;
import com.interviewace.dto.LoginRequest;
import com.interviewace.dto.RegisterRequest;
import com.interviewace.dto.TokenRefreshRequest;
import com.interviewace.model.User;
import com.interviewace.repository.UserRepository;
import com.interviewace.security.JwtTokenProvider;
import com.interviewace.security.UserDetailsImpl;
import com.interviewace.security.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Create new user account
        User user = User.builder()
                .email(registerRequest.getEmail())
                .passwordHash(encoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .role(registerRequest.getRole())
                .build();

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userRepository.findByEmail(userDetails.getUsername()).map(User::getFullName).orElse(""))
                .roles(roles)
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        if (jwtTokenProvider.validateJwtToken(requestRefreshToken)) {
            String email = jwtTokenProvider.getUsernameFromJwtToken(requestRefreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            UserDetailsImpl userPrincipal = (UserDetailsImpl) userDetails;

            String newAccessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
            String newRefreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

            List<String> roles = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(AuthResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .userId(userPrincipal.getId())
                    .email(userPrincipal.getUsername())
                    .fullName(userRepository.findByEmail(userPrincipal.getUsername()).map(User::getFullName).orElse(""))
                    .roles(roles)
                    .build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token!");
    }
}
