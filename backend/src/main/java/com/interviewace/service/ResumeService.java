package com.interviewace.service;

import com.interviewace.model.Resume;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ResumeService {
    Resume uploadAndAnalyzeResume(MultipartFile file, UUID userId) throws IOException;
    Resume getResumeById(UUID resumeId);
    List<Resume> getResumesByUserId(UUID userId);
    void deleteResume(UUID resumeId);
}
