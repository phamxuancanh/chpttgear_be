package fit.iuh.com.controller;

import fit.iuh.com.model.Specification;
import fit.iuh.com.service.SpecificationService;
import lombok.AllArgsConstructor;
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

    @PostMapping("/{productId}/specifications/")
    public ResponseEntity<Specification> createSpecification(@RequestBody Specification specification, @PathVariable("productId") UUID productId) {
        Specification createdSpecification = specificationService.createSpecification(specification, productId);
        return ResponseEntity.ok(createdSpecification);
    }

    @PutMapping("/{productId}/specifications/{specId}")
    public ResponseEntity<Specification> updateSpecification(@RequestBody Specification specification, @PathVariable("specId") UUID specId, @PathVariable("productId") UUID productId) {
        Specification updatedSpecification = specificationService.updateSpecification(specification, specId, productId);
        return ResponseEntity.ok(updatedSpecification);
    }
}
