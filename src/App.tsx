import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Scholarships from './pages/Scholarships';
import Universities from './pages/Universities';
import Majors from './pages/Majors';
import Opportunities from './pages/Opportunities';
import Dashboard from './pages/Dashboard';
import Profile from "./pages/Profile";
import HighSchoolStudent from "./pages/HighSchoolStudent";



const Layout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/high-school-student" element={<HighSchoolStudent />} />
          <Route path="/profile" element={<Profile />} />
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="universities" element={<Universities />} />
          <Route path="majors" element={<Majors />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;