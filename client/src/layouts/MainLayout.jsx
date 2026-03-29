import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ToastContainer from '../components/ui/ToastContainer'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <ToastContainer />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
