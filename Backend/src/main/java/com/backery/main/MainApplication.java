package com.backery.main;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.backery.main.Model.Role;
import com.backery.main.Model.User;
import com.backery.main.Repository.UserRepository;

// import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) {

		// Dotenv dotenv = Dotenv.load();
		// System.setProperty("DB_URL", dotenv.get("DB_URL"));
		// System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		// System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		// System.setProperty("jwt.secret", dotenv.get("secretKey"));

		SpringApplication.run(MainApplication.class, args);
	}

	@Bean
	CommandLineRunner run(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
				User admin = new User();

				admin.setFull_name("Super Admin");
				admin.setEmail("admin@gmail.com");
				admin.setPassword(passwordEncoder.encode("Password"));
				admin.setCreated_at(LocalDateTime.now());
				admin.setRole(Role.ROLE_ADMIN);
				userRepository.save(admin);
			}
		};
	}

}