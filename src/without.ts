import type { Product } from "./types/product";

class Inventory {
  private products: Product[] = [];

  constructor(initialProducts: Product[] = []) {
    this.products = initialProducts;
  }

  getProducts(): Product[] {
    return this.products;
  }

  insertProduct(product: Product) {
    this.products.push(product);
  }

  removeProduct(productId: number) {
    this.products = this.products.filter((product) => product.id !== productId);
  }
}

class ShoppingCart {
  inventory: Inventory;

  constructor() {
    // Las modificaciones en la clase de inventario no deberían afectar la clase ShoppingCart
    this.inventory = new Inventory();
  }

  viewCart() {
    console.table(this.inventory.getProducts());
  }

  clearCart() {
    const products = this.inventory.getProducts();

    for (const product of products) {
      this.inventory.removeProduct(product.id);
    }
  }

  getTotalPrice() {
    let total = 0;

    const products = this.inventory.getProducts();

    for (const product of products) {
      total += product.price;
    }

    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(total);
  }

  addToCart(product: Product) {
    this.inventory.insertProduct(product);
  }

  removeFromCart(productId: number) {
    this.inventory.removeProduct(productId);
  }
}

const myCart = new ShoppingCart();
myCart.viewCart();
console.log("Total price:", myCart.getTotalPrice());
