package com.example.myislandapi;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class MyIslandApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
