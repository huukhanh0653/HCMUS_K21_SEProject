package com.DiscordClone.GCSService;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class StorageService {

    private final Storage storage;

    @Value("${gcp.storage.bucket-name}")
    private String bucketName;

    public StorageService() {
        this.storage = StorageOptions.getDefaultInstance().getService(); // Uses ADC
    }

    public Storage getStorage() {
        return storage;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

        storage.create(blobInfo, file.getBytes());

        return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
    }

    public Resource downloadFile(String fileName) throws MalformedURLException {
        Path path = Path.of(String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName));
        return new UrlResource(path.toUri());
    }

    public boolean deleteFile(String fileName) {
        BlobId blobId = BlobId.of(bucketName, fileName);
        return storage.delete(blobId);
    }
}

