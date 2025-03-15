package com.example.ratingservice.Service;

import com.example.ratingservice.Repository.IReviewRepository;
import com.example.ratingservice.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

public class RatingServiceImpl implements IRatingService {
    @Autowired
    private final IReviewRepository iReviewRepository;
    public RatingServiceImpl(IReviewRepository iReviewRepository) {
        this.iReviewRepository = iReviewRepository;
    }

    @Override
    public void createUpdate(Review param) {
        iReviewRepository.save(param);
    }

    @Override
    public List<? extends Object> find(UUID product_id) {
        if(product_id == null || product_id.equals("") )
            return iReviewRepository.findAll();
        else return iReviewRepository.findByProductId(product_id);
    }
}
