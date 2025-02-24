package fit.iuh.com.controller;

import fit.iuh.com.model.Category;
import fit.iuh.com.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
//@AllArgsConstructor
public class CategoriesController {
    private final CategoryService categoryService;

    public CategoriesController(final CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories/findAllCategories")
    public List<Category> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return categories;
    }

    @GetMapping("/categories/{id}")
    public Category getCategoryById(@PathVariable UUID id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping("/categories/createCategory")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category newCategory = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).allow(HttpMethod.POST).body(newCategory);
    }
}