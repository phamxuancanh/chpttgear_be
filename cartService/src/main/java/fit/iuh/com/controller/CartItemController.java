package fit.iuh.com.controller;

import fit.iuh.com.model.Cart;
import fit.iuh.com.model.CartItem;
import fit.iuh.com.repository.CartItemRepository;
import fit.iuh.com.service.CartItemService;
import fit.iuh.com.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CartItemController {
    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService, CartService cartService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping("/cart_items")
    public List<CartItem> getAllCartItem() {
        return cartItemService.getAll();
    }

    @GetMapping("/cart_items/{id}")
    public CartItem getCartItemById(@PathVariable UUID id) {
        CartItem cartItem = cartItemService.getOneById(id);
        if (cartItem == null) {
            return null;
        } else {
            return cartItem;
        }
    }

    @PostMapping("/cart_items")
    public CartItem createCartItem(@RequestBody CartItem cartItem) {
        return cartItemService.createOne(cartItem);
    }

    @PostMapping("/cart_items/{id}")
    public CartItem updateCartItem(@RequestBody CartItem cartItem, @PathVariable UUID id) {
        return cartItemService.updateOne(cartItem, id);
    }
}
