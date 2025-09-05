import Avatar from '../ui/Avatar'

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">Panel de control</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium">David Ochoa</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>
        <Avatar name="David Ochoa" size={40} />
      </div>
    </header>
  )
}

export default Header
