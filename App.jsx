import { Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-700 text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold border-b-2 border-white pb-1'
                : 'hover:underline'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold border-b-2 border-white pb-1'
                : 'hover:underline'
            }
          >
            Contacts
          </NavLink>
          <NavLink
            to="/interviews"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold border-b-2 border-white pb-1'
                : 'hover:underline'
            }
          >
            Interviews
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              isActive
                ? 'font-semibold border-b-2 border-white pb-1'
                : 'hover:underline'
            }
          >
            Documents
          </NavLink>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
