import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Email validation (RFC 5322 simplified)
export function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// Password validation: min 8 chars, at least 1 letter, 1 number, 1 special char
export function validatePassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

// Username validation: min 3 chars, alphanumeric and underscores only
export function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,}$/.test(username);
}

// Debounce utility for functions (default 350ms)
export function debounce(fn, delay = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Extract user ID from JWT token in cookies
export function getUserIdFromRequest(req) {
  const token = req.cookies?.get ? req.cookies.get("token")?.value : req.cookies?.token;
  if (!token) throw new Error("No token found in cookies");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
}
