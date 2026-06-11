package com.interviewace.controller;

import com.interviewace.model.Interview;
import com.interviewace.model.InterviewAnswer;
import com.interviewace.model.InterviewType;
import com.interviewace.model.Question;
import com.interviewace.repository.QuestionRepository;
import com.interviewace.security.UserDetailsImpl;
import com.interviewace.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping("/start")
    public ResponseEntity<?> startInterview(
            @RequestParam("title") String title,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam("type") InterviewType type) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            Interview interview = interviewService.startInterview(userDetails.getId(), title, jobDescription, type);
            return ResponseEntity.status(HttpStatus.CREATED).body(interview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error starting interview session: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Interview>> getMyInterviews() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<Interview> interviews = interviewService.getInterviewsByUserId(userDetails.getId());
        return ResponseEntity.ok(interviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterview(@PathVariable UUID id) {
        Interview interview = interviewService.getInterviewById(id);
        return ResponseEntity.ok(interview);
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<Question>> getInterviewQuestions(@PathVariable UUID id) {
        List<Question> questions = questionRepository.findByInterviewIdOrderByOrderIndexAsc(id);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/{id}/submit-answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable UUID id,
            @RequestParam("questionId") UUID questionId,
            @RequestParam("userAnswer") String userAnswer,
            @RequestParam(value = "audioUrl", required = false) String audioUrl) {
        try {
            InterviewAnswer answer = interviewService.submitAnswer(id, questionId, userAnswer, audioUrl);
            return ResponseEntity.ok(answer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting answer: " + e.getMessage());
        }
    }

    @PostMapping("/code/execute")
    public ResponseEntity<?> executeCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String language = payload.get("language");
        String expectedOutput = payload.get("expectedOutput");

        Map<String, Object> runResult = interviewService.executeCode(code, language, expectedOutput);
        return ResponseEntity.ok(runResult);
    }
}
