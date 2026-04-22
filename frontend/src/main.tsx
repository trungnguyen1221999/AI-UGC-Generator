import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ClerkProvider } from '@clerk/react';
import { dark } from '@clerk/themes';
import React from 'react'

createRoot(document.getElementById('root')! as HTMLElement).render(
    <React.StrictMode>
        <ClerkProvider
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            afterSignInUrl="/"
            afterSignUpUrl="/"
            appearance={{
                theme: dark,
                variables: {
                    colorPrimary: '#7462fa',
                    colorText: '#ffffff',
                },
            }}
        >
            <App />
        </ClerkProvider>
    </React.StrictMode>
)