import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './helpers/variables.css';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import axios from 'axios';
import store from './store/index';

axios.defaults.baseURL = process.env.REACT_APP_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;

axios.get('/sanctum/csrf-cookie').then(response => {
    // Axios makes some magic and sets CSRF protection
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </BrowserRouter >
);
