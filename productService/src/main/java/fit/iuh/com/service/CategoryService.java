package fit.iuh.com.service;

import fit.iuh.com.repository.CategoryRepository;
import fit.iuh.com.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(UUID id){
        return categoryRepository.findById(id).orElse(null);
    }

    public List<Category> getCategoriesByName(String name) {
        return categoryRepository.findCategoriesByNameContaining(name);
    }

    public Category createCategory(Category category){
        return categoryRepository.save(category);
    }

    public Category updateCategory(Category category, UUID id){
       if (categoryRepository.findById(id).orElse(null) == null){
           return null;
       }
       return categoryRepository.save(category);
    }

    public Category deleteCategory(UUID id){
        Category category = categoryRepository.findById(id).orElse(null);
        if(category != null){
            categoryRepository.delete(category);
        }
        return category;
    }
}
