import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-gray-800">Scholarships LB</a>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-800 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-800 hover:text-blue-600">Scholarships</a>
            <a href="#" className="text-gray-800 hover:text-blue-600">About Us</a>
            <a href="#" className="text-gray-800 hover:text-blue-600">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Future Scholarship</h1>
          <p className="text-xl mb-8">Empowering Lebanese students to achieve their academic dreams.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100">Explore Scholarships</button>
        </div>
      </div>

      {/* Scholarship Cards Section */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Scholarships</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Scholarship Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Lebanese Diaspora Scholarship</h3>
            <p className="text-gray-600 mb-4">A scholarship for Lebanese students studying abroad.</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Engineering</span>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full ml-2">Undergraduate</span>
          </div>

          {/* Scholarship Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Local University Grant</h3>
            <p className="text-gray-600 mb-4">Financial aid for students attending universities in Lebanon.</p>
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Business</span>
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full ml-2">Graduate</span>
          </div>

          {/* Scholarship Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Technology Innovation Fund</h3>
            <p className="text-gray-600 mb-4">Supporting students pursuing degrees in technology and IT.</p>
            <span className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">Computer Science</span>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full ml-2">All Levels</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;