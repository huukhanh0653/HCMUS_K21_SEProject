package com.DiscordClone.NotificationService.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.DiscordClone.NotificationService.model.Notification;

@Repository
public interface NotificationRepository extends CrudRepository<Notification, String> {
}
