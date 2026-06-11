package com.interviewace.service;

import com.interviewace.model.Interview;
import com.interviewace.model.InterviewAnswer;
import com.interviewace.model.InterviewType;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface InterviewService {
    Interview startInterview(UUID userId, String title, String jobDescription, InterviewType type);
    Interview getInterviewById(UUID interviewId);
    List<Interview> getInterviewsByUserId(UUID userId);
    InterviewAnswer submitAnswer(UUID interviewId, UUID questionId, String userAnswer, String audioUrl);
    Map<String, Object> executeCode(String code, String language, String expectedOutput);
}
