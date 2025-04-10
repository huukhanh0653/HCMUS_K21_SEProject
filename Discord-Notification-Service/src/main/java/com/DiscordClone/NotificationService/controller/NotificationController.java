package com.DiscordClone.NotificationService.controller;

import com.DiscordClone.NotificationService.model.MuteSettings;
import com.DiscordClone.NotificationService.model.Notification;
import com.DiscordClone.NotificationService.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestBody Notification notification) {
        Notification sent = notificationService.sendNotification(notification);
        if (sent == null) {
            return ResponseEntity.ok("Notification muted by user preferences.");
        }
        return ResponseEntity.ok(sent);
    }

    @PostMapping("/mute/{userId}")
    public ResponseEntity<?> updateMuteSettings(
            @PathVariable String userId,
            @RequestBody MuteSettings newSettings) {
        newSettings.setUserId(userId); // Ensure correct binding
        notificationService.updateMuteSettings(userId, newSettings);
        return ResponseEntity.ok("Mute settings updated successfully.");
    }

    @GetMapping("/mute/{userId}")
    public ResponseEntity<?> getMuteSettings(@PathVariable String userId) {
        MuteSettings settings = notificationService.getMuteSettings(userId);
        if (settings == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(settings);
    }
}
