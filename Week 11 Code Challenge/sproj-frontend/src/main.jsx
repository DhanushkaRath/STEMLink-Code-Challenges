import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import HomePage from "./lib/pages/home.page";
import SignInPage from "./lib/pages/sign-in.page";
import SignUpPage from "./lib/pages/sign-up.page";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  // </StrictMode>
);