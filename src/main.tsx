
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { seedDatabase } from './utils/databaseSeeder.ts'

// Only run seeder in development to set up initial data
if (process.env.NODE_ENV === 'development') {
  seedDatabase().catch(console.error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
