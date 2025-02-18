package com.example.ratingservice.dao;

import com.example.ratingservice.model.Product_Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface Product_Rating_DAO extends JpaRepository<Product_Rating, UUID> {
    Product_Rating findProduct_RatingById(UUID id);
}