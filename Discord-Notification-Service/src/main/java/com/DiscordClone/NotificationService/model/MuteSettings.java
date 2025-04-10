package com.DiscordClone.NotificationService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RedisHash("MuteSettings")
public class MuteSettings {
    @Id
    private String userId;
    private Set<String> mutedChannels = new HashSet<>();
    private Set<String> mutedServers = new HashSet<>();
    private Set<String> mutedUsers = new HashSet<>();

    public MuteSettings(String userId) {
        this.userId = userId;
        this.mutedChannels = new HashSet<>();
        this.mutedServers = new HashSet<>();
        this.mutedUsers = new HashSet<>();
    }

}
