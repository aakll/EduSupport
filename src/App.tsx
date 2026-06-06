import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';

// --- Page Components ---

const Home = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Lebanon Scholarships</h1>
    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
      Empowering Lebanese students to achieve their academic dreams. Find scholarships, 
      explore universities, and discover new opportunities tailored for you.
    </p>
    <Link to="/scholarships" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
      Browse Scholarships
    </Link>
  </div>
);

const Login = () => (
  <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Student Login</h2>
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" placeholder="student@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500" placeholder="••••••••" />
      </div>
      <button type="button" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition">
        Sign In
      </button>
    </form>
  </div>
);

const Scholarships = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Scholarships</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-100">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Excellence Scholarship {i}</h3>
          <p className="text-gray-600 mb-4">Full tuition coverage for undergraduate studies at top Lebanese universities.</p>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Open</span>
        </div>
      ))}
    </div>
  </div>
);

const Universities = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Partner Universities</h2>
    <p className="text-gray-600">Explore our network of partner institutions across Lebanon and abroad.</p>
    {/* Add university list/grid here */}
  </div>
);

const Majors = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Academic Majors</h2>
    <p className="text-gray-600">Discover scholarships filtered by your field of study (Engineering, Medicine, Arts, etc.).</p>
    {/* Add majors list/grid here */}
  </div>
);

const Opportunities = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Career & Exchange Opportunities</h2>
    <p className="text-gray-600">Internships, exchange programs, and workshops for Lebanese youth.</p>
    {/* Add opportunities list/grid here */}
  </div>
);

const Dashboard = () => (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h2>
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <p className="text-gray-600">Welcome back! Here you can track your applications, saved scholarships, and profile.</p>
      {/* Add dashboard widgets here */}
    </div>
  </div>
);

const NotFound = () => (
  <div className="text-center py-20">
    <h2 className="text-6xl font-bold text-gray-300">404</h2>
    <p className="text-xl text-gray-600 mt-4">Page not found.</p>
    <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
  </div>
);

// --- Layout Component ---
// This wraps all pages with a shared Navbar and Footer
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-wide mb-4 md:mb-0">
            🇱🇧 Lebanon Scholarships
          </Link>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/scholarships" className="hover:text-blue-200 transition">Scholarships</Link>
            <Link to="/universities" className="hover:text-blue-200 transition">Universities</Link>
            <Link to="/majors" className="hover:text-blue-200 transition">Majors</Link>
            <Link to="/opportunities" className="hover:text-blue-200 transition">Opportunities</Link>
            <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/login" className="bg-white text-blue-900 px-4 py-1.5 rounded-md font-bold hover:bg-blue-100 transition">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area (Outlet renders the matched child route) */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <p>&copy; {new Date().getFullYear()} Lebanon Scholarships. Empowering the next generation.</p>
      </footer>
    </div>
  );
};

// --- Main App Component ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside this Layout will share the Navbar and Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="universities" element={<Universities />} />
          <Route path="majors" element={<Majors />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;