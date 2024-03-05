import type { Product } from "./types/product";

export class Inventory {
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

export class ShoppingCart {
  inventory: Inventory;

  constructor(inventory: Inventory) {
    this.inventory = inventory;
  }

  viewCart() {
    console.table(
      this.inventory.getProducts().map((product) => ({
        id: product.id,
        title: product.title,
        rating: product.rating,
        stock: product.stock,
        price: product.price,
      }))
    );
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

async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (response.status === 401) {
    throw new Error("Unauthorized");
  } else if (response.status === 404) {
    throw new Error("Not found");
  }

  const { products } = (await response.json()) as {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  };

  return products;
}

async function main() {
  const products = await getProducts();

  const inventory = new Inventory(products);
  const myCart = new ShoppingCart(inventory);

  myCart.addToCart({
    id: 91,
    title: "Black Motorbike",
    description:
      "Engine Type:Wet sump, Single Cylinder, Four Stroke, Two Valves, Air Cooled with SOHC (Single Over Head Cam) Chain Drive Bore & Stroke:47.0 x 49.5 MM",
    price: 5_000_000,
    discountPercentage: 13.63,
    rating: 4.04,
    stock: 115,
    brand: "METRO 70cc Motorcycle - MR70",
    category: "motorcycle",
    thumbnail: "https://cdn.dummyjson.com/product-images/91/thumbnail.jpg",
    images: [
      "https://cdn.dummyjson.com/product-images/91/1.jpg",
      "https://cdn.dummyjson.com/product-images/91/2.jpg",
      "https://cdn.dummyjson.com/product-images/91/3.jpg",
      "https://cdn.dummyjson.com/product-images/91/4.jpg",
      "https://cdn.dummyjson.com/product-images/91/thumbnail.jpg",
    ],
  });

  myCart.viewCart();
  console.log("Total price:", myCart.getTotalPrice());
}

main();
