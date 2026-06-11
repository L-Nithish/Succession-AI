package com.interviewace.controller;

import com.interviewace.model.Resume;
import com.interviewace.security.UserDetailsImpl;
import com.interviewace.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Please select a file to upload.");
        }

        try {
            // Retrieve authenticated UserDetails from Security Context
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            Resume resume = resumeService.uploadAndAnalyzeResume(file, userDetails.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(resume);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: Failed to process resume file upload: " + e.getMessage());
        } catch (ClassCastException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Authentication credentials not valid.");
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Resume>> getMyResumes() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<Resume> resumes = resumeService.getResumesByUserId(userDetails.getId());
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable UUID id) {
        Resume resume = resumeService.getResumeById(id);
        return ResponseEntity.ok(resume);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable UUID id) {
        try {
            resumeService.deleteResume(id);
            return ResponseEntity.ok("Resume deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: Failed to delete resume: " + e.getMessage());
        }
    }
}
