package com.backery.main.Service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backery.main.DTO.SignInDTO;
import com.backery.main.DTO.SignUpDTO;
import com.backery.main.Exception.EntityAlreadyExistsException;
import com.backery.main.Exception.NotFoundException;
import com.backery.main.Model.Role;
import com.backery.main.Model.User;
import com.backery.main.Repository.UserRepository;
import com.backery.main.Response.AuthResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthResponse signUp(SignUpDTO user) throws Exception {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EntityAlreadyExistsException("Email already Exists");
        }

        User newUser = new User();

        newUser.setFull_name(user.getFull_name());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setCreated_at(LocalDateTime.now());
        newUser.setRole(Role.ROLE_CUSTOMER);

        newUser = userRepository.save(newUser);
        String token = jwtService.generateToken(newUser);

        return new AuthResponse(token, newUser.getFull_name(), newUser.getEmail(), newUser.getRole().name());
    }

    public AuthResponse signIn(SignInDTO admin) {
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(admin.getEmail(), admin.getPassword()));
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid credentials");
        }

        User userToLogin = userRepository.findByEmail(admin.getEmail())
                .orElseThrow(() -> new NotFoundException("general", "Invalid credentials"));

        String token = jwtService.generateToken(userToLogin);
        return new AuthResponse(token, userToLogin.getFull_name(), userToLogin.getEmail(),
                userToLogin.getRole().name());
    }
}
