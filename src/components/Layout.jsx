import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:bg-primary-700 transition-colors">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                Saudi Scholarships
              </span>
            </Link>


          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <GraduationCap className="text-primary-600" size={24} />
            <span className="text-lg font-bold text-slate-800">Saudi Scholarships</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Saudi Scholarships Helper.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
