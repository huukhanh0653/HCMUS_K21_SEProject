package com.DiscordClone.NotificationService.repository;

import com.DiscordClone.NotificationService.model.Notification;
import org.springframework.data.repository.CrudRepository;

public interface NotificationRepository extends CrudRepository<Notification, String> {}