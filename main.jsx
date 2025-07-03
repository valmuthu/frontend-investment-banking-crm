import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import Contacts from './Contacts.jsx'
import Interviews from './Interviews.jsx'
import Documents from './Documents.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="documents" element={<Documents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
