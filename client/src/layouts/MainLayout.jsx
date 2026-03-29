import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
