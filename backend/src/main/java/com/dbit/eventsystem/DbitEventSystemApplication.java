package com.dbit.eventsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DbitEventSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(DbitEventSystemApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" DBIT College Event Management System Backend Started ");
        System.out.println(" Server Port: 8080                               ");
        System.out.println(" API Base URL: http://localhost:8080/api         ");
        System.out.println("=================================================");
    }
}
