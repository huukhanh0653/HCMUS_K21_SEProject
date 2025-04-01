package com.DiscordClone.GCSService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class GcsServiceApplicationTests {

	@Test
	void testContextLoads() {
		GcsServiceApplicationTests applicationTests = new GcsServiceApplicationTests();
		assertDoesNotThrow(applicationTests::contextLoads, "contextLoads method should not throw any exception");
	}

	@Test
	void testApplicationStartsWithoutErrors() {
		assertDoesNotThrow(() -> {
			GcsServiceApplication.main(new String[] {});
		}, "Application should start without throwing any exceptions");
	}

	@Test
	void testContextLoadsMultipleTimes() {
		GcsServiceApplicationTests applicationTests = new GcsServiceApplicationTests();
		assertDoesNotThrow(applicationTests::contextLoads, "contextLoads method should not throw any exception");
		assertDoesNotThrow(applicationTests::contextLoads,
				"contextLoads method should not throw any exception on second call");
	}

}
