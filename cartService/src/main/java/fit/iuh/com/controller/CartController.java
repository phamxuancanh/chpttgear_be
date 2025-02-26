package fit.iuh.com.controller;

import fit.iuh.com.model.Cart;
import fit.iuh.com.model.CartItem;
import fit.iuh.com.service.CartService;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/carts/findAllCart")
    public ResponseEntity<List<Cart>> getAllCart () {
        return ResponseEntity.ok(cartService.getAllCarts());
    }

    @GetMapping("/carts/findByUserId/{userId}")
    public ResponseEntity<Cart> getCartByUserId (@PathVariable("userId") UUID userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @GetMapping("/carts/findByCartId/{cartId}")
    public ResponseEntity<Cart> getCartById (@PathVariable("cartId") UUID cartId) {
        Cart cart = cartService.getById(cartId);
        if (cart == null) {
            return null;
        }
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/carts/createCart")
    public ResponseEntity<Cart> createCart(@RequestBody Cart cart) {
        Cart newCart = cartService.createCart(cart);
        return ResponseEntity.status(HttpStatus.CREATED).allow(HttpMethod.POST).body(newCart);
    }

    @DeleteMapping("/carts/deleteByCartId/{cartId}")
    public ResponseEntity<Cart> deleteCart(@PathVariable("cartId") UUID cartId) {
        return ResponseEntity.ok(cartService.deleteCart(cartId));
    }
}
