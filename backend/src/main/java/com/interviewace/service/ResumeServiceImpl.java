package com.interviewace.service;

import com.interviewace.model.Resume;
import com.interviewace.model.SkillProgress;
import com.interviewace.model.User;
import com.interviewace.repository.ResumeRepository;
import com.interviewace.repository.SkillProgressRepository;
import com.interviewace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final Path fileStorageLocation;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillProgressRepository skillProgressRepository;

    public ResumeServiceImpl() {
        // Define storage location relative to workspace root
        this.fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    @Transactional
    public Resume uploadAndAnalyzeResume(MultipartFile file, UUID userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Generate unique filename to prevent overwriting
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(storedFileName);

        // Save file to uploads folder
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Read basic content (if text-based) or mock extraction
        String contentText = extractText(file);

        // Analyze content and extract skills
        List<String> skills = analyzeSkills(contentText);
        String experienceSummary = generateExperienceSummary(contentText, user.getFullName());
        String analysisReport = generateMockAnalysisReport(skills, user.getFullName());

        // Create Resume Entity
        Resume resume = Resume.builder()
                .user(user)
                .fileName(originalFileName != null ? originalFileName : "resume.pdf")
                .fileUrl(targetLocation.toString())
                .parsedContent(contentText)
                .skills(skills)
                .experienceSummary(experienceSummary)
                .analysisReport(analysisReport)
                .build();

        Resume savedResume = resumeRepository.save(resume);

        // Update Skill Progress for the User
        updateUserSkillProgress(user, skills);

        return savedResume;
    }

    @Override
    public Resume getResumeById(UUID resumeId) {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + resumeId));
    }

    @Override
    public List<Resume> getResumesByUserId(UUID userId) {
        return resumeRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void deleteResume(UUID resumeId) {
        Resume resume = getResumeById(resumeId);
        try {
            Path filePath = Paths.get(resume.getFileUrl());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log file deletion failure but continue entity removal
        }
        resumeRepository.delete(resume);
    }

    private String extractText(MultipartFile file) {
        // Simple extraction for demo: read basic text files or fallback to metadata
        try {
            String contentType = file.getContentType();
            if (contentType != null && (contentType.contains("text") || contentType.contains("json"))) {
                return new String(file.getBytes());
            }
        } catch (Exception e) {
            // Ignore and fallback
        }
        // Fallback mock resume text
        return "Experienced Software Engineer. Core expertise in building Java backend microservices using Spring Boot, JPA, and PostgreSQL. "
                + "Proficient in frontend components with React, TypeScript, and Tailwind CSS. Familiar with deployment pipelines using Docker, "
                + "Kubernetes, Redis caching, and Kafka event streaming platforms. Worked on scalable REST APIs and AWS cloud environments.";
    }

    private List<String> analyzeSkills(String content) {
        String[] keywords = {"Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Docker", "Kafka", "AWS", "Python", "Kubernetes", "Redis", "Security"};
        List<String> matchedSkills = new ArrayList<>();
        String lowerContent = content.toLowerCase();

        for (String skill : keywords) {
            if (lowerContent.contains(skill.toLowerCase())) {
                matchedSkills.add(skill);
            }
        }

        if (matchedSkills.isEmpty()) {
            matchedSkills.addAll(Arrays.asList("Java", "Spring Boot", "React"));
        }
        return matchedSkills;
    }

    private String generateExperienceSummary(String content, String name) {
        return "Software Engineer profile identified for " + name + ". Shows 3+ years of experience focusing on backend service architecture, relational database schemas, and modern responsive frontend design.";
    }

    private String generateMockAnalysisReport(List<String> skills, String name) {
        return "### Resume Feedback Report for " + name + "\n\n"
                + "#### Key Strengths\n"
                + "- **Strong Stack Alignment:** Detected core competencies in: " + String.join(", ", skills) + ".\n"
                + "- **Microservices Ready:** Resume outlines experience in horizontal scaling, REST APIs, and database mapping.\n\n"
                + "#### Areas of Improvement\n"
                + "- **System Design Detail:** Include more metrics regarding latency optimizations or caching strategies (e.g. Redis implementations).\n"
                + "- **Testing Coverage:** Add details about unit testing coverage levels (e.g. JUnit, Mockito) or automated CI/CD checks.";
    }

    private void updateUserSkillProgress(User user, List<String> skills) {
        Random rand = new Random();
        for (String skill : skills) {
            Optional<SkillProgress> existingProgress = skillProgressRepository.findByUserIdAndSkillName(user.getId(), skill);
            int score = 65 + rand.nextInt(25); // Seed a score between 65 and 90

            if (existingProgress.isPresent()) {
                SkillProgress progress = existingProgress.get();
                // Retain higher score if it exists
                if (progress.getRating() < score) {
                    progress.setRating(score);
                    skillProgressRepository.save(progress);
                }
            } else {
                SkillProgress newProgress = SkillProgress.builder()
                        .user(user)
                        .skillName(skill)
                        .rating(score)
                        .weakPoints("Identified for revision based on resume check. Practice mock interviews to increase this score.")
                        .build();
                skillProgressRepository.save(newProgress);
            }
        }
    }
}
