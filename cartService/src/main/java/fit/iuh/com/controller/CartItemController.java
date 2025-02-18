package fit.iuh.com.controller;

import fit.iuh.com.model.CartItem;
import fit.iuh.com.service.CartItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CartItemController {
    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping("/cart_items")
    public List<CartItem> getAllCartItem() {
        return cartItemService.getAll();
    }

    @GetMapping("/cart_items/{id}")
    public CartItem getCartItemById(@PathVariable UUID id) {
        CartItem cartItem = cartItemService.getById(id);
        if (cartItem == null) {
            return null;
        } else {
            return cartItem;
        }
    }

    @PostMapping("/cart_items")
    public CartItem createCartItem(@RequestBody CartItem cartItem) {
        int maxQuantity = 1000;
        if (cartItem.getQuantity() < 0 && cartItem.getQuantity() > maxQuantity) {
            return null;
        } else {
            return cartItemService.createOne(cartItem);
        }
    }

    @PutMapping("/cart_items/{id}")
    public CartItem updateCartItem(@RequestBody CartItem cartItem, @PathVariable UUID id) {
        int maxQuantity = 1000;
        if (cartItem.getQuantity() < 0 && cartItem.getQuantity() > maxQuantity) {
            return null;
        } else {
            return cartItemService.updateOne(cartItem, id);
        }
    }

    @DeleteMapping("/cart_items/{id}")
    public CartItem deleteCartItem(@PathVariable UUID id) {
        return cartItemService.deleteOne(id);
    }
}
