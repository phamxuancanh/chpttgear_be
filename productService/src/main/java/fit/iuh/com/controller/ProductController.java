package fit.iuh.com.controller;

import fit.iuh.com.model.Product;
import fit.iuh.com.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products/searchProducts")
    public ResponseEntity<Map<String, Object>> getMyProducts(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "8") int size, @RequestParam(required = false) String search, @RequestParam(required = false) String category) {
        try {
            Page<Product> productPage = productService.getProductsPaged(page, size, search, category);
            Map<String, Object> response = new HashMap<>();
            response.put("page", page);
            response.put("size", size);
            response.put("totalRecords", productPage.getTotalElements());
            response.put("data", productPage.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Đã xảy ra lỗi khi lấy danh sách sản phẩm."));
        }
    }
    @GetMapping("/products/findByIds")
    public ResponseEntity<List<Product>> getProducts(@RequestParam List<String> productIds) {
        List<Product> products = productService.getProductsByIds(productIds);
        return ResponseEntity.ok(products);
    }
    @GetMapping("products/getSuggestions")
    public ResponseEntity<List<Product>> getSuggestions(@RequestParam(required = false) String search) {
        List<Product> suggestions = productService.getSuggestions(search);
        return ResponseEntity.ok(suggestions);
    }
    @GetMapping("/products/findById/{id}")
    public Product getProductById(@PathVariable UUID id) {
        System.out.println("chay vao 2");
        Product product = productService.getProduct(id);
        if (product == null) {
            return null;
        } else {
            return product;
        }
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product) {
        System.out.println("test create");
        return productService.createProduct(product);
    }

    @PostMapping("/products/{id}")
    public Product updateProduct(@RequestBody Product product, @PathVariable UUID id) {
        return productService.updateProduct(product, id);
    }

}