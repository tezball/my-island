package com.example.myislandapi;

import com.example.myislandapi.config.TestcontainersConfiguration;
import org.springframework.boot.SpringApplication;

public class TestMyIslandApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(MyIslandApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
