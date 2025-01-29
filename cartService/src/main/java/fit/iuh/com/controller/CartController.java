package fit.iuh.com.controller;

import fit.iuh.com.model.Cart;
import fit.iuh.com.repository.CartItemRepository;
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
    public Cart getCart (@PathVariable UUID id) {
        Cart cart = cartService.getOneById(id);
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

    @PostMapping("/carts/{id}")
    public Cart updateCart(@RequestBody Cart cart, @PathVariable UUID id) {
        return cartService.updateOne(cart, id);
    }
}
