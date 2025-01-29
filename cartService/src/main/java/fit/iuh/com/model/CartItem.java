package fit.iuh.com.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "cartItems")
public class CartItem {
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    @Column(name = "cart_item_id")
    private UUID id;
    private UUID productId;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cart_id", columnDefinition = "UUID")
    @JsonIgnoreProperties("cartItems")
    private Cart cart;
    private int quantity;

    public CartItem () {

    }

    public CartItem(UUID id, UUID productId, Cart cart, int quantity) {
        this.id = id;
        this.productId = productId;
        this.cart = cart;
        this.quantity = quantity;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", productId=" + productId +
                ", cart=" + cart +
                ", quantity=" + quantity +
                '}';
    }
}
