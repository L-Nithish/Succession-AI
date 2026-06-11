package com.interviewace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration.class,
    org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration.class,
    org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration.class
})
@EnableAsync
public class InterviewAceApplication {
    public static void main(String[] args) {
        SpringApplication.run(InterviewAceApplication.class, args);
    }
}
