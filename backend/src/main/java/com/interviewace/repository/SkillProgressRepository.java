package com.interviewace.repository;

import com.interviewace.model.SkillProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillProgressRepository extends JpaRepository<SkillProgress, UUID> {
    List<SkillProgress> findByUserId(UUID userId);
    Optional<SkillProgress> findByUserIdAndSkillName(UUID userId, String skillName);
}
