package com.DiscordClone.NotificationService.service;

import com.DiscordClone.NotificationService.model.Notification;
import com.DiscordClone.NotificationService.model.MuteSettings;
import com.DiscordClone.NotificationService.repository.NotificationRepository;
import com.DiscordClone.NotificationService.repository.MuteSettingsRepository;
import com.DiscordClone.NotificationService.service.WebSocketNotificationHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final MuteSettingsRepository muteSettingsRepo;
    private final WebSocketNotificationHandler notificationHandler;

    public Notification sendNotification(Notification notification) {
        MuteSettings settings = muteSettingsRepo.findById(notification.getReceiverId()).orElse(null);
        if (settings != null) {
            if ((notification.getType().equals("DIRECT_MESSAGE") && settings.getMutedUsers().contains(notification.getSourceId())) ||
                    (notification.getType().equals("SERVER_ALERT") && settings.getMutedServers().contains(notification.getSourceId())) ||
                    (notification.getType().equals("CHANNEL_ALERT") && settings.getMutedChannels().contains(notification.getSourceId()))) {
                return null; // muted, skip sending
            }
        }

        notification.setId(UUID.randomUUID().toString());
        notification.setTimestamp(LocalDateTime.now().toString());
        notificationRepo.save(notification);

        // Use custom WebSocket handler
        notificationHandler.sendToUser(notification.getReceiverId(), notification);

        return notification;
    }

    public Optional<Notification> getNotification(String id) {
        return notificationRepo.findById(id);
    }

    public List<Notification> getAllNotificationsForUser(String userId) {
        List<Notification> results = new ArrayList<>();
        for (Notification n : notificationRepo.findAll()) {
            if (n.getReceiverId().equals(userId)) {
                results.add(n);
            }
        }
        return results;
    }

    public void deleteNotification(String id) {
        notificationRepo.deleteById(id);
    }

    public MuteSettings getMuteSettings(String userId) {
        return muteSettingsRepo.findById(userId).orElse(null);
    }

    public void updateMuteSettings(String userId, MuteSettings newSettings) {
        newSettings.setUserId(userId);
        muteSettingsRepo.save(newSettings);
    }

    public void mute(String userId, String serverId, String channelId, String mutedUserId) {
        MuteSettings settings = muteSettingsRepo.findById(userId).orElse(new MuteSettings(userId));

        if (serverId != null) settings.getMutedServers().add(serverId);
        if (channelId != null) settings.getMutedChannels().add(channelId);
        if (mutedUserId != null) settings.getMutedUsers().add(mutedUserId);

        muteSettingsRepo.save(settings);
    }

    public void unmute(String userId, String serverId, String channelId, String mutedUserId) {
        MuteSettings settings = muteSettingsRepo.findById(userId).orElse(new MuteSettings(userId));

        if (serverId != null) settings.getMutedServers().remove(serverId);
        if (channelId != null) settings.getMutedChannels().remove(channelId);
        if (mutedUserId != null) settings.getMutedUsers().remove(mutedUserId);

        muteSettingsRepo.save(settings);
    }
}
