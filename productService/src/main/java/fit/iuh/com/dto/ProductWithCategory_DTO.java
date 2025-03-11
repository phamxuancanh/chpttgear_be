package fit.iuh.com.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
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
    private String category_type;

}
