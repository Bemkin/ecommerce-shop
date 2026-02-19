"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { fetchCategories } from "@/store/slices/categoriesSlice";

function ThemeHandler({ children }: { children: React.ReactNode }) {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Initial Data Fetch
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeHandler>
        {children}
        <Toaster richColors position="bottom-right" />
      </ThemeHandler>
    </Provider>
  );
}
