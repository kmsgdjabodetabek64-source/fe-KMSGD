import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/navbar/Navbar'
import Footer from '../components/common/Footer'
import ScrollToTop from '../routes/ScrollToTop'

const RootLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main>
      <ScrollToTop />
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default RootLayout
