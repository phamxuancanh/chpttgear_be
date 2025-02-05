package com.example.ratingservice.controller;
import com.example.ratingservice.model.Review_Reply;
import com.example.ratingservice.service.Review_Reply_Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class Review_Reply_Controller {

    private final Review_Reply_Service reviewReplyService;

    public Review_Reply_Controller(Review_Reply_Service reviewReplyService) {
        this.reviewReplyService = reviewReplyService;
    }

    @GetMapping("/review_replies")
    public List<Review_Reply> getAllReviewReply(){
        return reviewReplyService.getAll();
    }

    @GetMapping("/review_replies/{id}")
    public Review_Reply getReviewReplyById(@PathVariable UUID id){
        return reviewReplyService.getById(id);
    }

    @PostMapping("/review_replies")
    public Review_Reply createReviewReply(Review_Reply reviewReply){
        return reviewReplyService.createOne(reviewReply);
    }

    @PutMapping("/review_replies/{id}")
    public Review_Reply updateReviewReply(Review_Reply reviewReply, UUID id){
        return reviewReplyService.updateOne(reviewReply, id);
    }

    @DeleteMapping("/review_replies/{id}")
    public Review_Reply deleteReviewReply(@PathVariable UUID id){
        return reviewReplyService.deleteOne(id);
    }
}
