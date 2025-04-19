package com.DiscordClone.NotificationService.service;

import com.DiscordClone.NotificationService.model.Notification;
import com.DiscordClone.NotificationService.model.MuteSettings;
import com.DiscordClone.NotificationService.repository.NotificationRepository;
import com.DiscordClone.NotificationService.repository.MuteSettingsRepository;
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
        MuteSettings settings = muteSettingsRepo.findById(notification.getChannelId()).orElse(null);
        if (settings != null) {
            // 🔁 Adjusted muting logic based on new Notification structure
            if ((notification.getSourceId() != null && settings.getMutedUsers().contains(notification.getSourceId())) ||
                    (notification.getServerId() != null && settings.getMutedServers().contains(notification.getServerId())) ||
                    (notification.getChannelId() != null && settings.getMutedChannels().contains(notification.getChannelId()))) {
                return null; // ⛔ Muted — skip sending
            }
        }

        // 🆕 Ensure ID and timestamp are set
        notification.setId(UUID.randomUUID().toString());
        notification.setTimestamp(LocalDateTime.now().toString());

        // 💾 Save to Redis
        notificationRepo.save(notification);

        // 🌐 Send via WebSocket
        notificationHandler.sendToUser(notification.getChannelId(), notification);

        return notification;
    }

    public Optional<Notification> getNotification(String id) {
        return notificationRepo.findById(id);
    }

    public List<Notification> getAllNotificationsForUser(String userId) {
        List<Notification> results = new ArrayList<>();
        for (Notification n : notificationRepo.findAll()) {
            if (n.getChannelId().equals(userId)) {
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
