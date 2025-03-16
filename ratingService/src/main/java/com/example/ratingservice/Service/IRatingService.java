package com.example.ratingservice.Service;

import com.example.ratingservice.entity.Review;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface IRatingService {
    void createUpdate(Review param);
    List<? extends Object> find(UUID product_id);
}
