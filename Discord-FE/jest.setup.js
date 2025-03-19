import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
});

// filepath: d:\HCMUS Code\Software Engineering Project\src\Discord-FE\jest.setup.js
process.env.VITE_FIREBASE_API_KEY = "AIzaSyBKlHIrMJDTZbNPK3xl8x1MoSNZTFYSAFQ";
process.env.VITE_FIREBASE_AUTH_DOMAIN = "discord-4ed5d.firebaseapp.com";
process.env.VITE_FIREBASE_PROJECT_ID = "discord-4ed5d";
process.env.VITE_FIREBASE_STORAGE_BUCKET = "discord-4ed5d.firebasestorage.app";
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = "865225418567";
process.env.VITE_FIREBASE_APP_ID = "1:865225418567:web:3e3a2831a0fc01d106ce62";
process.env.VITE_FIREBASE_MEASUREMENT_ID = "G-0MZ8JV6C14";
