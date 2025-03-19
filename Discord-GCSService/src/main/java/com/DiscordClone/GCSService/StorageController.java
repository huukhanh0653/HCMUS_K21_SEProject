package com.DiscordClone.GCSService;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/storage")
@CrossOrigin(origins = "*")  // Allows requests from any origin (Frontend)
public class StorageController {

    private static final Logger LOGGER = Logger.getLogger(StorageController.class.getName());
    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * Upload a file to Google Cloud Storage.
     */
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            String fileUrl = storageService.uploadFile(file);
            return ResponseEntity.ok("File uploaded successfully: " + fileUrl);

        } catch (IOException e) {
            LOGGER.severe("File upload failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
        }
    }

    /**
     * Download a file from Google Cloud Storage.
     */
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Resource resource = storageService.downloadFile(fileName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            LOGGER.severe("File not found: " + fileName + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Delete a file from Google Cloud Storage.
     */
    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        try {
            boolean deleted = storageService.deleteFile(fileName);
            if (deleted) {
                return ResponseEntity.ok("File deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
            }
        } catch (Exception e) {
            LOGGER.severe("Error deleting file: " + fileName + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting file: " + e.getMessage());
        }
    }
}
