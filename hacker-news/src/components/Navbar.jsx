import { NavLink } from 'react-router-dom'

const navItems = [
  { name: 'Ask Stories', path: '/' },
  { name: 'Best Stories', path: '/best' },
  { name: 'Job Stories', path: '/jobs' },
  { name: 'New Stories', path: '/new' },
  { name: 'Show Stories', path: '/show' },
  { name: 'Top Stories', path: '/top' },
  { name: 'Leaders', path: '/leaders' },
]

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-900 text-white">
      {navItems.map(item => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            isActive ? 'font-bold underline' : ''
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}