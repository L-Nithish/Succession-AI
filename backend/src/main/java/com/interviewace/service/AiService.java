package com.interviewace.service;

import java.util.List;
import java.util.Map;

public interface AiService {
    List<Map<String, String>> generateQuestionsForInterview(String jobDescription, List<String> skills, int count);
    Map<String, Object> evaluateAnswer(String question, String answer);
    String generateRoadmap(List<String> skills, String targetJob);
    String generateRecruiterInsights(String userName, List<String> skills, int averageScore);
}
