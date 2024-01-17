// https://usehooks-ts.com/
// https://usehooks-ts.com/react-hook/use-read-local-storage
// useReadLocalStorage hook is incompatible with string only (non-JSON) localStorage values, modified under MIT license

import { useCallback, useEffect, useState } from "react";
import { UseEventListener } from "./UseEventListener";

type Value<T> = T | null

export function UseReadLocalStorage<T>(key: string): Value<T> {
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = useCallback((): Value<T> => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === "undefined") {
            return null;
        }

        let item: string | null = "";

        try {
            item = window.localStorage.getItem(key);
        }
        catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return null;
        }

        // try return as T
        try {
            return item ? item as T : null;
        }
        catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return null;
        }
    }, [key])

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<Value<T>>(readValue);

    // Listen if localStorage changes
    useEffect(() => {
        setStoredValue(readValue())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStorageChange = useCallback(
        (event: StorageEvent | CustomEvent) => {
            if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
                return;
            }
            setStoredValue(readValue());
        },
        [key, readValue],
    )

    // this only works for other documents, not the current one
    UseEventListener("storage", handleStorageChange);

    return storedValue;
}
