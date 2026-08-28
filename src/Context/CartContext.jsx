import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  // LOAD CART FROM LOCAL STORAGE
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");

    return savedCart ? JSON.parse(savedCart) : [];
  });


  // SAVE CART TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);


  // ADD PRODUCT TO CART
  const addToCart = (product) => {
    setCartItems((currentItems) => {

      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );

      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];

    });
  };


  // INCREASE QUANTITY
  const increaseQuantity = (id) => {

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

  };


  // DECREASE QUANTITY
  const decreaseQuantity = (id) => {

    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  };


  // REMOVE ITEM
  const removeItem = (id) => {

    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );

  };


  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };


  // TOTAL NUMBER OF PRODUCTS
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );


  // CART SUBTOTAL
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}