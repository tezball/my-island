package com.example.myislandapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MyIslandApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyIslandApiApplication.class, args);
	}

}
