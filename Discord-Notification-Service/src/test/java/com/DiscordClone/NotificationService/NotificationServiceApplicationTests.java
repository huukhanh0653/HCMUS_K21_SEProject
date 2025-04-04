package com.DiscordClone.NotificationService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class NotificationServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void applicationStartsSuccessfully() {
		NotificationServiceApplication.main(new String[] {});
		assertNotNull(NotificationServiceApplication.class);
	}

	@Test
	void applicationFailsToStartWithInvalidArgs() {
		assertThrows(Exception.class, () -> {
			NotificationServiceApplication.main(new String[] {"invalidArg"});
		});
	}

	@Test
	void applicationFailsToStartWithNullArgs() {
		assertThrows(NullPointerException.class, () -> {
			NotificationServiceApplication.main(null);
		});
	}

	@Test
	void applicationStartsWithinAcceptableTime() {
		assertTimeout(Duration.ofSeconds(5), () -> {
			NotificationServiceApplication.main(new String[] {});
		});
	}



}