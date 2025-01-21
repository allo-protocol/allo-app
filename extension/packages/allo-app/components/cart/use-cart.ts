"use client";
import { useEffect } from "react";
import { Address, getAddress, parseUnits } from "viem";
import { createGlobalState } from "~/hooks/use-global-state";

const useCartState = createGlobalState<Record<string, number | undefined>>(
  JSON.parse(global.localStorage?.getItem("cart") ?? "{}")
);

export function useCart() {
  // Initialize cart state from localStorage, defaulting to an empty object
  const [items, setCart] = useCartState();

  // Update or remove an item in the cart (undefined removes)
  const set = (id: string, allocation?: number) =>
    setCart((state) => ({ ...state, [id]: allocation }));

  // Check if the cart contains a valid allocation for a specific item
  const contains = (id: string) => id in items && typeof items[id] === "number";

  // Clear all items from the cart
  const reset = () => setCart({});

  // Get a list of all item IDs with valid allocations
  const list = Object.keys(items)
    .filter((id) => typeof items[id] === "number")
    .map(getAddress);

  // Sum the cart allocations
  const sum = Object.values(items).reduce(
    (sum, x) => (x ? sum + BigInt(x) : sum),
    BigInt(0)
  );

  // Persist cart state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  return { items, contains, set, reset, sum, list };
}

// Build arrays of recipients and parsed token amounts
export function buildAllocations(
  cartItems: Record<string, bigint | number | undefined>,
  decimals = 18
): [Address[], bigint[]] {
  console.log(cartItems, decimals);
  return Object.entries(cartItems).reduce(
    ([recipients, amounts], [address, allocation]) =>
      (allocation ?? 0) > 0
        ? [
            recipients.concat(getAddress(address)),
            amounts.concat(parseUnits(String(allocation ?? 0), decimals)),
          ]
        : [recipients, amounts],
    [[], []] as [Address[], bigint[]]
  );
}
