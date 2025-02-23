package fit.iuh.com.service;

import fit.iuh.com.model.Specification;
import fit.iuh.com.repository.ProductRepository;
import fit.iuh.com.repository.SpecificationRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
//@AllArgsConstructor
public class SpecificationService {
    public final SpecificationRepository specificationRepository;
    public final ProductRepository productRepository;

    public SpecificationService(SpecificationRepository specificationRepository, ProductRepository productRepository) {
        this.specificationRepository = specificationRepository;
        this.productRepository = productRepository;
    }

    public List<Specification> getAllSpecifications() {
        return specificationRepository.findAll();
    }

    public List<Specification> getSpecificationsByProductId(UUID productId) {
        if (productRepository.findById(productId).orElse(null) == null) {
            throw new RuntimeException("Product not found");
        }
        List<Specification> list = specificationRepository.findAllByProductId(productId);
        return list;
    }

    public List<String> getAllSpecificationNames() {
        List<String> list = new ArrayList<>();
        specificationRepository.findAll().forEach(specification -> list.add(specification.getName()));
        return list;
    }

    public Specification getSpecificationById(UUID id) {
        return specificationRepository.findById(id).orElse(null);
    }

    public Specification createSpecification(Specification specification) {
        if (productRepository.findById(specification.getProduct().getId()).orElse(null) == null) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        return specificationRepository.save(specification);
    }

    public Specification updateSpecification(Specification specification, UUID specId) {
        specificationRepository.findById(specId).orElseThrow(()
                -> new RuntimeException("Specification not found"));
        Specification updateSpec = specificationRepository.findById(specId).orElse(null);
        updateSpec.setValue(specification.getValue());
        return specificationRepository.save(updateSpec);
    }
}
