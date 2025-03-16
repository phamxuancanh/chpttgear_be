package fit.iuh.com.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class ProductWithCategory_DTO {
    private UUID id;
    private String name;
    private String description;
    private double price;
    private String image;
    private String brand;
    private String color;
    private String size;
    private double weight;
    private int guaranteePeriod;
    private LocalDateTime modifiedDate;
    private UUID category_id;
    private String categoryName;

    // ✅ Constructor đúng thứ tự với HQL
    public ProductWithCategory_DTO(UUID id, String name, String description, double price, String image,
                                   String brand, String color, String size, double weight, int guaranteePeriod,
                                   LocalDateTime modifiedDate, UUID category_id, String categoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.brand = brand;
        this.color = color;
        this.size = size;
        this.weight = weight;
        this.guaranteePeriod = guaranteePeriod;
        this.modifiedDate = modifiedDate;
        this.category_id = category_id;
        this.categoryName = categoryName;
    }
}
