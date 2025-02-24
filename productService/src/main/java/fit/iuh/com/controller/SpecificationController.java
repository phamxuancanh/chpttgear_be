package fit.iuh.com.controller;

import fit.iuh.com.model.Product;
import fit.iuh.com.model.Specification;
import fit.iuh.com.service.ProductService;
import fit.iuh.com.service.SpecificationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
//@AllArgsConstructor
public class SpecificationController {
    private final SpecificationService specificationService;

    public SpecificationController(SpecificationService specificationService) {
        this.specificationService = specificationService;
    }

    @GetMapping("/specifications/findAllSpecifications")
    public ResponseEntity<List<Specification>> getAllSpecifications() {
        List<Specification> specifications = specificationService.getAllSpecifications();
        return ResponseEntity.ok(specifications);
    }

    @GetMapping("/specifications/findByProductId/{productId}")
    public ResponseEntity<List<Specification>> getSpecificationsByProductId(@PathVariable("productId") UUID productId) {
        List<Specification> specifications = specificationService.getSpecificationsByProductId(productId);
        for (Specification specification : specifications) {
            System.out.println(specification);
        }
        return ResponseEntity.ok(specifications);
    }

    @GetMapping("/specification/getAllName")
    public ResponseEntity<List<String>> getAllSpecificationNames() {
        List<String> specifications = specificationService.getAllSpecificationNames();
        return ResponseEntity.ok(specifications);
    }

    @GetMapping("/specification/{id}")
    public ResponseEntity<Specification> getSpecificationById(UUID id) {
        Specification specification = specificationService.getSpecificationById(id);
        return ResponseEntity.ok(specification);
    }

    @PostMapping("/specifications/createSpecification")
    public ResponseEntity<Specification> createSpecification(@RequestBody Specification specification) {
        Specification newSpecification = specificationService.createSpecification(specification);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSpecification);
    }

    @PutMapping("/specifications/{specId}")
    public ResponseEntity<Specification> updateSpecification(@RequestBody Specification specification, @PathVariable("specId") UUID specId) {
        Specification updatedSpecification = specificationService.updateSpecification(specification, specId);
        return ResponseEntity.ok(updatedSpecification);
    }
}
