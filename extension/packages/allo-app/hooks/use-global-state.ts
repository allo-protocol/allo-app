import { useState, useEffect } from "react";

// A helper type for actions that can be either a new state
// value or a function computing a new state from the previous one.
type SetStateAction<S> = S | ((prev: S) => S);

export function createGlobalState<S>(initialState: S) {
  // Central store shared by all consumers of the hook
  const store = {
    state: initialState,
    subscribers: new Set<React.Dispatch<React.SetStateAction<S>>>(),
    setState(action: SetStateAction<S>) {
      // Compute the next state
      store.state =
        typeof action === "function"
          ? (action as (prev: S) => S)(store.state)
          : action;

      // Notify all subscribers
      store.subscribers.forEach((subscriber) => {
        subscriber(store.state);
      });
    },
  };

  // Return a hook that reads and updates the global state
  return function useGlobalState(): [S, (action: SetStateAction<S>) => void] {
    // Local state to trigger updates in this component
    const [localState, setLocalState] = useState<S>(store.state);

    // Subscribe on mount, unsubscribe on unmount
    useEffect(() => {
      store.subscribers.add(setLocalState);
      return () => {
        store.subscribers.delete(setLocalState);
      };
    }, []);

    return [localState, store.setState];
  };
}
