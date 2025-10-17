// Página principal

import { useEffect, useState } from 'react';
import axiosInstance from '../config/axios';
import StatsCard from './StatsCard';
import { Link } from 'react-router-dom';
import BookList from './Book/BookList';
import Navbar from './Navbar';


// Layout wrapper
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-image bg-cover bg-center bg-fixed">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// Página principal
const Home = () => {
  
    const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/books?limit=1000');
        const books = response.data.data || response.data;

        const totalBooks = books.length;
        const readingBooks = books.filter(book => book.reading_status === 'Leyendo').length;
        const completedBooks = books.filter(book => book.reading_status === 'Leído').length;

        setStats({
          total: totalBooks,
          reading: readingBooks,
          completed: completedBooks,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  
    return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a tu Biblioteca Personal
          </h1>
          <p className="text-gray-600">
            Gestiona y organiza tu colección de libros de manera sencilla
          </p>
        </div>
        </div>

        
         {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-600">Cargando estadísticas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard 
              label="Total Libros" 
              count={stats.total} 
              icon="📚" 
              color="#6366f1"
            />
            <StatsCard 
              label="Leyendo" 
              count={stats.reading} 
              icon="📖" 
              color="#10b981"
            />
            <StatsCard 
              label="Completados" 
              count={stats.completed} 
              icon="✅" 
              color="#8b5cf6"
            />
            </div>
        )}

        {/* Sección de libros */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tus Libros</h2>
            <Link
              to="/books/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Libro</span>
            </Link>
          </div>
          
          {/* Aquí irá tu componente de lista de libros */}
          <BookList />
        </div>
      </div>
    </Layout>
  );
};

export default Home;