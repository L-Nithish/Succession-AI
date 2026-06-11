package com.interviewace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", nullable = false)
    @NotNull
    private Interview interview;

    @NotBlank
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "expected_keywords", columnDefinition = "TEXT")
    private String expectedKeywords;

    @Column(name = "sample_answer", columnDefinition = "TEXT")
    private String sampleAnswer;

    @NotNull
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}
