package com.DiscordClone.NotificationService.service;

import com.DiscordClone.NotificationService.model.Notification;
import com.DiscordClone.NotificationService.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Optional<Notification> getNotification(String id) {
        return notificationRepository.findById(id);
    }

    public Iterable<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public boolean deleteNotification(String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }


    public Notification updateNotification(String id, Notification updatedNotification) {
        return notificationRepository.findById(id)
                .map(existingNotification -> {
                    existingNotification.setMessage(updatedNotification.getMessage());
                    existingNotification.setUserId(updatedNotification.getUserId());
                    existingNotification.setRead(updatedNotification.isRead());
                    return notificationRepository.save(existingNotification);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
    }
}
