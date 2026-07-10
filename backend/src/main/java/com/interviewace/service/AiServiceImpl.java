package com.interviewace.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.*;

@Service
public class AiServiceImpl implements AiService {
    private static final Logger logger = LoggerFactory.getLogger(AiServiceImpl.class);

    @Value("${app.openai.api-key:}")
    private String apiKey;

    @Value("${app.openai.model:gpt-4o-mini}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<Map<String, String>> generateQuestionsForInterview(String jobDescription, List<String> skills, int count) {
        if (isApiKeyConfigured()) {
            try {
                return callOpenAiForQuestions(jobDescription, skills, count);
            } catch (Exception e) {
                logger.warn("OpenAI API call failed, falling back to mock generator: {}", e.getMessage());
            }
        }
        return generateMockQuestions(skills, count);
    }

    @Override
    public Map<String, Object> evaluateAnswer(String question, String answer) {
        if (isApiKeyConfigured()) {
            try {
                return callOpenAiForEvaluation(question, answer);
            } catch (Exception e) {
                logger.warn("OpenAI API call failed, falling back to mock evaluator: {}", e.getMessage());
            }
        }
        return evaluateMockAnswer(question, answer);
    }

    @Override
    public String generateRoadmap(List<String> skills, String targetJob) {
        if (isApiKeyConfigured()) {
            try {
                return callOpenAiForRoadmap(skills, targetJob);
            } catch (Exception e) {
                logger.warn("OpenAI API call failed, falling back to mock roadmap generator: {}", e.getMessage());
            }
        }
        return generateMockRoadmap(skills, targetJob);
    }

    @Override
    public String generateRecruiterInsights(String userName, List<String> skills, int averageScore) {
        if (isApiKeyConfigured()) {
            try {
                return callOpenAiForRecruiterInsights(userName, skills, averageScore);
            } catch (Exception e) {
                logger.warn("OpenAI API call failed, falling back to mock recruiter insights: {}", e.getMessage());
            }
        }
        return generateMockRecruiterInsights(userName, skills, averageScore);
    }

    private boolean isApiKeyConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.startsWith("placeholder");
    }

    // ==========================================
    // OPENAI CLIENT CALLS (Standard RestTemplate)
    // ==========================================

    private String callOpenAi(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        
        Map<String, Object> requestBody = Map.of(
            "model", modelName,
            "messages", List.of(Map.of("role", "user", "content", prompt)),
            "temperature", 0.7
        );
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                return (String) message.get("content");
            }
        }
        throw new RuntimeException("Invalid response format from OpenAI");
    }

    private List<Map<String, String>> callOpenAiForQuestions(String jobDesc, List<String> skills, int count) {
        String prompt = String.format(
            "You are an expert interviewer. Generate %d technical interview questions based on this job description: '%s' and these skills: %s. "
            + "Respond ONLY in a JSON array format where each element is an object with keys: 'questionText', 'expectedKeywords', and 'sampleAnswer'. "
            + "Do not wrap in markdown or backticks.",
            count, jobDesc, String.join(", ", skills)
        );

        try {
            String content = callOpenAi(prompt);
            return objectMapper.readValue(content, new TypeReference<List<Map<String, String>>>() {});
        } catch (Exception e) {
            logger.error("Failed to parse OpenAI response for questions", e);
            throw new RuntimeException("Failed to generate questions from OpenAI", e);
        }
    }

    private Map<String, Object> callOpenAiForEvaluation(String question, String answer) {
        String prompt = String.format(
            "Evaluate the following answer to this interview question.\nQuestion: %s\nAnswer: %s\n"
            + "Respond ONLY in a JSON object format with keys: 'score' (integer 0-100) and 'feedback' (string with markdown formatting). "
            + "Do not wrap in markdown or backticks.",
            question, answer
        );
        try {
            String content = callOpenAi(prompt);
            return objectMapper.readValue(content, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            logger.error("Failed to parse OpenAI response for evaluation", e);
            throw new RuntimeException("Failed to generate evaluation from OpenAI", e);
        }
    }

    private String callOpenAiForRoadmap(List<String> skills, String targetJob) {
        String prompt = String.format(
            "Generate a dynamic week-by-week learning roadmap for a candidate aiming to be a '%s' with current skills: %s. "
            + "Format as a clean markdown string with headers for weeks and focus areas.",
            targetJob, String.join(", ", skills)
        );
        return callOpenAi(prompt);
    }

    private String callOpenAiForRecruiterInsights(String userName, List<String> skills, int averageScore) {
        String prompt = String.format(
            "Write a brief recruiter insights assessment (Executive Verdict) for candidate '%s' with skills: %s, who scored an average of %d/100 in mock interviews. "
            + "Format as markdown.",
            userName, String.join(", ", skills), averageScore
        );
        return callOpenAi(prompt);
    }

    // ==========================================
    // OFFLINE MOCK FALLBACKS (Zero-cost immediately running)
    // ==========================================

    private List<Map<String, String>> generateMockQuestions(List<String> skills, int count) {
        List<Map<String, String>> pool = new ArrayList<>();

        Map<String, String> q1 = Map.of(
            "questionText", "Can you explain the difference between optimistic and pessimistic locking in JPA/Hibernate, and when to use which?",
            "expectedKeywords", "Version annotation, Database lock, Concurrent updates, Rollback",
            "sampleAnswer", "Optimistic locking uses a @Version column check on update to detect concurrent updates without locking DB rows. Pessimistic locking locks the rows at database level directly using SELECT FOR UPDATE."
        );
        Map<String, String> q2 = Map.of(
            "questionText", "How does the virtual DOM work in React, and how does it compare to the real DOM?",
            "expectedKeywords", "Reconciliation, Diffing algorithm, Render, State changes",
            "sampleAnswer", "React keeps a lightweight virtual representation of the DOM in memory. On state changes, it generates a new virtual tree, diffs it with the old tree, and bats updates to the real DOM."
        );
        Map<String, String> q3 = Map.of(
            "questionText", "What is a Kafka topic partition, and how does it enable horizontal scalability?",
            "expectedKeywords", "Consumer group, Parallelism, Offset, Key hash",
            "sampleAnswer", "Partitions are ordered log sequences within a topic. They allow topics to be distributed across multiple brokers. Different consumers in a consumer group can read partitions in parallel."
        );
        Map<String, String> q4 = Map.of(
            "questionText", "Explain how you would secure a REST API using JWT and Spring Security.",
            "expectedKeywords", "SecurityFilterChain, OncePerRequestFilter, SecurityContextHolder, Token validation",
            "sampleAnswer", "Inject a Custom JWT Filter before UsernamePasswordAuthenticationFilter. The filter parses the header, validates the signature, extracts user authority claims, and registers them in SecurityContextHolder."
        );
        Map<String, String> q5 = Map.of(
            "questionText", "How do you optimize a multi-stage Dockerfile for a Spring Boot application?",
            "expectedKeywords", "Layer caching, Alpine, Copy target, JRE container",
            "sampleAnswer", "Use multi-stage builds: build the JAR file using Maven image in stage one, then copy only the jar file into a lightweight JRE-only base image like eclipse-temurin:21-jre-alpine in stage two."
        );

        pool.add(q1);
        pool.add(q2);
        pool.add(q3);
        pool.add(q4);
        pool.add(q5);

        List<Map<String, String>> selected = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            selected.add(pool.get(i % pool.size()));
        }
        return selected;
    }

    private Map<String, Object> evaluateMockAnswer(String question, String answer) {
        Map<String, Object> result = new HashMap<>();
        if (answer == null || answer.trim().length() < 30) {
            result.put("score", 45);
            result.put("feedback", "Your answer is too short and lacks detail. For interview questions of this depth, please provide code structures, framework behaviors, and real-world project context.");
            return result;
        }

        // Base score calculation based on text features
        int baseScore = 65;
        List<String> strengths = new ArrayList<>();
        List<String> gaps = new ArrayList<>();

        String lowerAns = answer.toLowerCase();

        // Check keyword matches to reward technical depth
        if (lowerAns.contains("version") || lowerAns.contains("lock") || lowerAns.contains("select for update")) {
            baseScore += 10;
            strengths.add("Understands row-locking mechanics and Hibernate versioning checks.");
        }
        if (lowerAns.contains("reconciliation") || lowerAns.contains("diff") || lowerAns.contains("render")) {
            baseScore += 10;
            strengths.add("Correctly identifies React reconciliation diffing cycles.");
        }
        if (lowerAns.contains("filter") || lowerAns.contains("stateless") || lowerAns.contains("bearer")) {
            baseScore += 10;
            strengths.add("Demonstrates clear knowledge of security filters and authorization interceptors.");
        }
        if (lowerAns.contains("stage") || lowerAns.contains("cache") || lowerAns.contains("alpine")) {
            baseScore += 5;
            strengths.add("Acknowledge lightweight containers and layer optimization standards.");
        }

        if (strengths.isEmpty()) {
            gaps.add("Lacks core keywords mapping to the framework architecture.");
        } else {
            gaps.add("Mention performance trade-offs, like network overhead or CPU diffing costs, to elevate your answer to senior level.");
        }

        int finalScore = Math.min(baseScore + (answer.length() / 80), 98);

        result.put("score", finalScore);
        result.put("feedback", String.format(
            "### Evaluation Report\n\n"
            + "**Strengths:**\n%s\n\n"
            + "**Areas for Growth:**\n%s",
            strengths.isEmpty() ? "- Needs technical keywords expansion." : "- " + String.join("\n- ", strengths),
            "- " + String.join("\n- ", gaps)
        ));

        return result;
    }

    private String generateMockRoadmap(List<String> skills, String targetJob) {
        return "# Dynamic Learning Roadmap: Target - " + targetJob + "\n\n"
                + "Prepared based on your skill indicators: " + String.join(", ", skills) + ".\n\n"
                + "## Week 1-2: Core Architecture & Framework Security\n"
                + "- **Focus:** Spring Boot 3 Security Filters & JWT claims verification.\n"
                + "- **Hands-on Task:** Implement a refresh token rotation model using Postgres database.\n\n"
                + "## Week 3-4: Distributed Systems & Event Streaming\n"
                + "- **Focus:** Kafka Partition offsets, Consumer groups, and Zookeeper integration.\n"
                + "- **Hands-on Task:** Write a Spring Boot service listening to resume upload topics to trigger async notifications.\n\n"
                + "## Week 5-6: Advanced UI & Animations\n"
                + "- **Focus:** Framer Motion scroll indicators, Lenis smooth scrolling, and custom React hook callbacks.\n"
                + "- **Hands-on Task:** Connect the Analytics dashboard components to the backend REST controllers.";
    }

    private String generateMockRecruiterInsights(String userName, List<String> skills, int averageScore) {
        return "### Recruiter Assessment Suite\n\n"
                + "**Candidate Name:** " + userName + "\n"
                + "**Primary Stack:** " + String.join(", ", skills) + "\n"
                + "**Preparation Index Score:** " + averageScore + "/100\n\n"
                + "#### Executive Verdict\n"
                + (averageScore >= 80 
                    ? "🌟 **Strong Technical Asset:** The candidate exhibits deep conceptual clarity. Recommended for direct scheduling with engineering managers."
                    : "📈 **Growth Potential:** Shows good foundations but needs mock sessions on system architecture and containerization.");
    }
}
