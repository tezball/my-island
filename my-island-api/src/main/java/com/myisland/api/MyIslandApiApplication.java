package com.myisland.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MyIslandApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyIslandApiApplication.class, args);
    }
}
