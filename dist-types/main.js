import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import './index.css';
import App from './App.tsx';
import { Toaster } from 'sonner';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsxs(BrowserRouter, { children: [_jsx(Toaster, { position: "top-right" }), _jsx(Routes, { children: _jsx(Route, { path: "*", element: _jsx(App, {}) }) })] }) }));
