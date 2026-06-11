package com.interviewace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "skill_progress",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "skill_name"})}
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @NotBlank
    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(nullable = false)
    private Integer rating;

    @Column(name = "weak_points", columnDefinition = "TEXT")
    private String weakPoints;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
