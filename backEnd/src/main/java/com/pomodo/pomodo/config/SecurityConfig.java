package com.pomodo.pomodo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Enable CORS configuration (defined in the corsConfigurationSource bean
                // below)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF protection. This is okay for a stateless REST API.
                .csrf(csrf -> csrf.disable())

                // 3. Configure authorization: Permit all requests for now.
                // This disables the default login page.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll() // Allow all requests to all endpoints
                        .anyRequest().authenticated())

                // 4. Set session management to STATELESS.
                // This tells Spring Security not to create sessions, which is ideal for a REST
                // API.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // !! IMPORTANT: Update this with your React app's URL !!

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));


        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));


        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
