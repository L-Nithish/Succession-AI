package com.interviewace.dto;

import com.interviewace.model.SkillProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private int totalInterviews;
    private int completedInterviews;
    private int averageScore;
    private int totalResumes;
    private List<SkillProgress> skills;
    private List<InterviewSummaryDto> recentInterviews;
    private Map<String, Integer> weeklyProgressTrend;
    private String aiCareerCoachInsight;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewSummaryDto {
        private String id;
        private String title;
        private String type;
        private String status;
        private Integer score;
        private String date;
    }
}
