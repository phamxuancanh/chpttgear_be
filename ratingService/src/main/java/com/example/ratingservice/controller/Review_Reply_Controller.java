package com.example.ratingservice.controller;
import com.example.ratingservice.model.Review_Reply;
import com.example.ratingservice.service.Review_Reply_Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class Review_Reply_Controller {

    private final Review_Reply_Service reviewReplyService;

    public Review_Reply_Controller(Review_Reply_Service reviewReplyService) {
        this.reviewReplyService = reviewReplyService;
    }

    @GetMapping("/review_replies")
    public List<Review_Reply> getAllReviewReply(){
        return reviewReplyService.getAllReview_Reply();
    }
}
