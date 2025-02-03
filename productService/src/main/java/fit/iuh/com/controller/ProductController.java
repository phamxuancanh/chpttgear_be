package fit.iuh.com.controller;

import fit.iuh.com.model.Category;
import fit.iuh.com.model.Product;
import fit.iuh.com.service.CategoryService;
import fit.iuh.com.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    // GET

    /**
     * GET ALL
     */
    @GetMapping("/products")
    public List<Product> getAllProduct(){
        return productService.getAllProduct();
    }


    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return categories;
    }

    /**
     * GET BY ID
     */
    @GetMapping("/products/{id}")
    public Product getProductById(@PathVariable UUID id){
        Product product = productService.getProduct(id);
        if(product == null){
            return null;
        } else {
            return product;
        }
    }

    @GetMapping("/categories/{id}")
    public Category getCategoryById(@PathVariable UUID id) {
        return categoryService.getCategoryById(id);
    }

    /**
     * GET BY NAME
     */

    @GetMapping("/products/{productName}")
    public List<Product> getProductsByName(@PathVariable String productName){
        return productService.getProductsByName(productName);
    }

    @GetMapping("/products/{categoryName}")
    public List<Product> getProductsByCategoryName(@PathVariable String categoryName){
        return productService.getProductsByCategoryName(categoryName);
    }

    /**
     * CREATE
     */
    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product){
        return productService.createProduct(product);
    }

    @PostMapping("/categories")
    public Category createCategory(@RequestBody Category category){
        return categoryService.createCategory(category);
    }

    /**
     * UPDATE
     */
    @PutMapping("/products/{id}")
    public Product updateProduct(@RequestBody Product product, @PathVariable UUID id){
        return productService.updateProduct(product, id);
    }

    @PutMapping("/categories/{id}")
    public Category updateCategory(@RequestBody Category category, @PathVariable UUID id){
        return categoryService.updateCategory(category, id);
    }

    /**
     * DELETE
     */

    @DeleteMapping("/products/{id}")
    public Product deleteProduct(@PathVariable UUID id){
        return productService.deleteProduct(id);
    }

    @DeleteMapping("/categories/{id}")
    public Category deleteCategory(@PathVariable UUID id){
        return categoryService.deleteCategory(id);
    }

}
