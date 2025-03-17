package fit.iuh.com.controller;

import fit.iuh.com.dto.ProductWithCategory_DTO;
import fit.iuh.com.model.Product;
import fit.iuh.com.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products/searchProducts")
    public ResponseEntity<Map<String, Object>> getMyProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Double price_gte,
            @RequestParam(required = false) Double price_lte,
            @RequestParam(required = false) String category,
            HttpServletRequest request) {

        // In ra tất cả các key của query string để debug
        Map<String, String[]> parameterMap = request.getParameterMap();
        parameterMap.forEach((k, v) -> System.out.println("Key: " + k + ", Value: " + Arrays.toString(v)));

        // Lấy các tham số có key bắt đầu bằng "spec_"
        Map<String, String> specFilters = new HashMap<>();
        for (String key : parameterMap.keySet()) {
            if (key.startsWith("spec_")) {
                // Loại bỏ tiền tố "spec_", trim và chuyển về chữ thường
                String specKey = key.substring(5).trim().toLowerCase();
                String[] values = parameterMap.get(key);
                if (values != null && values.length > 0 && !values[0].trim().isEmpty()) {
                    specFilters.put(specKey, values[0].trim().toLowerCase());
                }
            }
        }
        // Chuyển các cặp spec thành danh sách chuỗi "key:value"
        List<String> specs = specFilters.entrySet().stream()
                .map(e -> e.getKey() + ":" + e.getValue())
                .collect(Collectors.toList());
        Long specCount = (long) specs.size();

        System.out.println("Category: " + category);
        System.out.println("Specs: " + specs);
        System.out.println("SpecCount: " + specCount);

        try {
            Page<Product> productPage = productService.getProductsPaged(
                    page, size, search, category, color, price_gte, price_lte, specs, specCount);
            Map<String, Object> response = new HashMap<>();
            response.put("page", page);
            response.put("size", size);
            response.put("totalRecords", productPage.getTotalElements());
            response.put("data", productPage.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Đã xảy ra lỗi khi lấy danh sách sản phẩm."));
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

    @GetMapping("products/getAllProductWithCategory")
    public ResponseEntity<List<ProductWithCategory_DTO>> getAllProductWithCategory() {
        List<ProductWithCategory_DTO> products = productService.getProductWithCategory();
        return ResponseEntity.ok(products);
    }

    /****************/

    @GetMapping("/products/findAllProducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/findById/{productId}")
    public Product getProductById(@PathVariable("productId") UUID id) {
        System.out.println("chay vao 2");
        Product product = productService.getProduct(id);
        if (product == null) {
            return null;
        } else {
            return product;
        }
    }

    @GetMapping("/products/managementPage")
    public ResponseEntity<Map<String, Object>> getProductManagementPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            Page<Product> productPage = productService.getProductsForManagement(page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("page", page);
            response.put("size", size);
            response.put("totalRecords", productPage.getTotalElements());
            response.put("data", productPage.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Đã xảy ra lỗi khi lấy danh sách sản phẩm."));
        }
    }

    @PostMapping("/products/createProduct")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product newProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).allow(HttpMethod.POST).body(newProduct);
    }

    @PutMapping("/products/updateProduct/{productId}")
    public ResponseEntity<Product> updateProduct(@RequestBody Product product, @PathVariable("productId") UUID id) {
        Product updatedProduct = productService.updateProduct(product, id);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/products/{productId}/price")
    public ResponseEntity<Product> updatePriceByProductId(@PathVariable("productId") UUID productId,
            @RequestBody Map<String, Double> request) {
        double newPrice = request.get("price").doubleValue();
        Product updatedProduct = productService.updatePriceByProductId(productId, newPrice);
        return ResponseEntity.ok(updatedProduct);
    }

    /***********************/
    @GetMapping("/products/{id}/similar")
    public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable UUID id) {
        List<Product> similarProducts = productService.getSimilarProducts(id);
        return ResponseEntity.ok(similarProducts);
    }
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProduct() {
        List<Product> productList = productService.getAllProducts();
        return ResponseEntity.ok(productList);
    }


}
