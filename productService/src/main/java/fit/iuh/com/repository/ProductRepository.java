package fit.iuh.com.repository;

import fit.iuh.com.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(CAST(p.name AS string)) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) " +
            "AND (:category IS NULL OR p.category.name = :category)")
    Page<Product> searchProducts(
            @Param("name") String name,
            @Param("category") String category,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(CAST(p.name AS string)) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) " +
            "ORDER BY p.id ASC")
    List<Product> suggestProducts(@Param("name") String name);

    @Query("SELECT p FROM Product p WHERE p.id IN :productIds ORDER BY p.id ASC")
    List<Product> findProductsByListIds(@Param("productIds") List<String> productIds);

    @Query("SELECT p FROM Product p order by p.id asc")
    Page<Product> getProductForManagement(Pageable pageable);
}