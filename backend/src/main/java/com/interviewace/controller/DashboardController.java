package com.interviewace.controller;

import com.interviewace.dto.DashboardStatsDto;
import com.interviewace.model.Interview;
import com.interviewace.model.Resume;
import com.interviewace.model.SkillProgress;
import com.interviewace.repository.InterviewRepository;
import com.interviewace.repository.ResumeRepository;
import com.interviewace.repository.SkillProgressRepository;
import com.interviewace.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private SkillProgressRepository skillProgressRepository;

    @GetMapping("/overview")
    public ResponseEntity<DashboardStatsDto> getDashboardOverview() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        UUID userId = userDetails.getId();

        // 1. Fetch resumes count
        List<Resume> resumes = resumeRepository.findByUserId(userId);
        int totalResumes = resumes.size();

        // 2. Fetch interviews stats
        List<Interview> interviews = interviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        int totalInterviews = interviews.size();
        
        long completedCount = interviews.stream()
                .filter(i -> i.getStatus().toString().equals("COMPLETED"))
                .count();
        
        int averageScore = 0;
        List<Interview> completedInterviews = interviews.stream()
                .filter(i -> i.getScore() != null)
                .collect(Collectors.toList());
        
        if (!completedInterviews.isEmpty()) {
            int sum = completedInterviews.stream().mapToInt(Interview::getScore).sum();
            averageScore = sum / completedInterviews.size();
        }

        // 3. Fetch Skill progress
        List<SkillProgress> skills = skillProgressRepository.findByUserId(userId);
        // Seed some starting skills if empty so the dashboard has rich mock data to render
        if (skills.isEmpty()) {
            skills = Arrays.asList(
                    SkillProgress.builder().skillName("Java").rating(80).weakPoints("OOP guidelines").build(),
                    SkillProgress.builder().skillName("React").rating(75).weakPoints("Hooks lifecycle").build(),
                    SkillProgress.builder().skillName("PostgreSQL").rating(70).weakPoints("Index layouts").build(),
                    SkillProgress.builder().skillName("Docker").rating(65).weakPoints("Multi-stage builds").build(),
                    SkillProgress.builder().skillName("Kafka").rating(60).weakPoints("Broker partition counts").build()
            );
        }

        // 4. Map recent interviews
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<DashboardStatsDto.InterviewSummaryDto> recent = interviews.stream()
                .limit(5)
                .map(i -> DashboardStatsDto.InterviewSummaryDto.builder()
                        .id(i.getId().toString())
                        .title(i.getTitle())
                        .type(i.getInterviewType().name())
                        .status(i.getStatus().name())
                        .score(i.getScore())
                        .date(i.getCreatedAt() != null ? i.getCreatedAt().format(formatter) : "")
                        .build())
                .collect(Collectors.toList());

        // 5. Generate mock weekly trend values
        Map<String, Integer> trend = new LinkedHashMap<>();
        trend.put("Mon", 65);
        trend.put("Tue", 70);
        trend.put("Wed", 78);
        trend.put("Thu", averageScore > 0 ? averageScore : 82);
        trend.put("Fri", averageScore > 0 ? (int) Math.min(averageScore * 1.05, 95) : 85);

        // 6. Formulate AI Career Coach Insight
        String insight;
        if (averageScore == 0) {
            insight = "Welcome to **InterviewAce AI**! 🚀 Upload a resume or start a technical session to activate your career coaching logs. Focus on backend fundamentals first.";
        } else if (averageScore >= 85) {
            insight = "🔥 **Excellent performance!** Your average mock score is " + averageScore + "%. Recruiters favor this rating. We recommend starting mock sessions for **System Design** to finalize your prep.";
        } else {
            insight = "💡 **Progress identified!** Your average score is " + averageScore + "%. Focus on strengthening your core skills in **" 
                    + skills.get(skills.size() - 1).getSkillName() + "** (currently at " + skills.get(skills.size() - 1).getRating() + "%).";
        }

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalResumes(totalResumes)
                .totalInterviews(totalInterviews)
                .completedInterviews((int) completedCount)
                .averageScore(averageScore)
                .skills(skills)
                .recentInterviews(recent)
                .weeklyProgressTrend(trend)
                .aiCareerCoachInsight(insight)
                .build();

        return ResponseEntity.ok(stats);
    }
}
