package fit.iuh.com.controller;

import fit.iuh.com.model.Cart;
import fit.iuh.com.model.CartItem;
import fit.iuh.com.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/carts")
    public List<Cart> getAllCart () {
        return cartService.getAll();
    }

    @GetMapping("/carts/{id}")
    public Cart getCartById (@PathVariable UUID id) {
        Cart cart = cartService.getById(id);
        if (cart == null) {
            return null;
        } else {
            return cart;
        }
    }

    @PostMapping("/carts")
    public Cart createCart(@RequestBody Cart cart) {
        return cartService.createOne(cart);
    }

    @PutMapping("/carts/{id}")
    public Cart updateCart(@RequestBody Cart cart, @PathVariable UUID id) {
        return cartService.updateOne(cart, id);
    }

    @DeleteMapping("/carts/{id}")
    public Cart deleteCart(@PathVariable UUID id) {
        return cartService.deleteOne(id);
    }
}
