package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@org.springframework.context.annotation.Configuration
public class Configuration {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("https://chpttgear-fe.vercel.app")
                        .allowedMethods("PUT", "DELETE", "GET", "POST", "OPTIONS")
                        .allowedHeaders("header1", "header2", "header3")
                        .exposedHeaders("Authorization", "X-Requested-With", "Content-Type")
                        .allowCredentials(false).maxAge(3600);
            }
        };
    }
}
