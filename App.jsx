import { Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-purple-50">
      <nav className="bg-purple-600 text-white p-4 flex gap-4">
        <NavLink to="/" className={({ isActive }) => isActive ? 'font-bold' : ''}>Dashboard</NavLink>
        <NavLink to="/contacts" className={({ isActive }) => isActive ? 'font-bold' : ''}>Contacts</NavLink>
        <NavLink to="/interviews" className={({ isActive }) => isActive ? 'font-bold' : ''}>Interviews</NavLink>
        <NavLink to="/documents" className={({ isActive }) => isActive ? 'font-bold' : ''}>Documents</NavLink>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}