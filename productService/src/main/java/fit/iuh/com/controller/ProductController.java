package fit.iuh.com.controller;

import fit.iuh.com.model.Product;
import fit.iuh.com.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public List<Product> getAllProduct(){
        return productService.getAllProduct();
    }


    @GetMapping("/products/{id}")
    public Product getProductById(@PathVariable UUID id){
        Product product = productService.getProduct(id);
        if(product == null){
            return null;
        } else {
            return product;
        }
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product){
        return productService.createProduct(product);
    }

    @PostMapping("/products/{id}")
    public Product updateProduct(@RequestBody Product product, @PathVariable UUID id){
        return productService.updateProduct(product, id);
    }

}
