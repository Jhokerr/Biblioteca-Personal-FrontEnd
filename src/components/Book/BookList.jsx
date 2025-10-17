// src/components/BookList.jsx

import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios"; // ← AGREGAR ESTO
import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BookModal from './BookModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const placeholderCover = "https://via.placeholder.com/150x200.png?text=Sin+Portada";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState(null);

  // Cargar libros
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No hay token, no cargando libros');
      setLoading(false);
      return;
    }
    
    console.log('Cargando libros con token');
    setLoading(true);
    
    axiosInstance
      .get('/books')
      .then((res) => {
        console.log('Libros cargados:', res.data);
        setBooks(res.data.data || res.data);
        setPagination(res.data);
      })
      .catch((error) => {
        console.error('Error cargando libros:', error.response?.status, error.response?.data);
        setBooks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

 const handleDelete = (id) => {
    setBookToDeleteId(id); // Guarda el ID del libro a eliminar
    setShowDeleteModal(true); // Muestra el modal
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const confirmDelete = () => {
    // 1. Oculta el modal inmediatamente
    setShowDeleteModal(false); 
    
    // Verifica que tengamos un ID para eliminar
    if (!bookToDeleteId) return;

    // 2. Ejecuta la lógica de eliminación con Axios
    axiosInstance
      .delete(`/books/${bookToDeleteId}`)
      .then(() => {
        // 3. Actualiza el estado de los libros
        setBooks(books.filter((book) => book.id !== bookToDeleteId));
        // Opcional: Mostrar una notificación de éxito (ej. Toast)
        console.log("Libro eliminado con éxito."); 
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
        alert("No se pudo eliminar el libro."); // Podrías reemplazar este alert también
      })
      .finally(() => {
        // 4. Limpia el ID guardado
        setBookToDeleteId(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookToDeleteId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-900">
        📚 Mi Biblioteca Personal
      </h1>

      {/* Buscador */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Busca por título, autor o género..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xl p-3 rounded-full shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
        />
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="text-center text-xl font-semibold text-gray-700">
          Cargando libros...
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center text-lg font-semibold text-gray-500">
          No hay libros disponibles. ¡Añade uno para empezar!
        </div>
      )}

      {/* Lista de libros */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        {filteredBooks.map((book) => (
          <div 
            key={book.id}
            className="flex items-center bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-gray-200 hover:border-indigo-400 cursor-pointer"
            onClick={() => openModal(book)}
          >
            {/* Portada */}
            <img 
              src={book.cover_url || placeholderCover}
              alt={`Portada de ${book.title}`}
              className="w-20 h-28 rounded-lg shadow-md object-cover border border-gray-300 flex-shrink-0"
            />

            {/* Info */}
            <div className="ml-4 flex-1 overflow-hidden">
              <h3 className="text-left text-lg font-bold text-gray-800 truncate">{book.title}</h3>
              <p className="text-left text-sm text-gray-600 italic truncate">{book.author}</p>

              {/* Género y año */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                {book.genre && <span className="truncate">📚 {book.genre}</span>}
                {book.published_year && <span>📅 {book.published_year}</span>}
                {book.pages && <span>📖 {book.pages} páginas</span>}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2 ml-4">
              <Link 
                to={`/books/${book.id}/edit`} 
                onClick={(e) => e.stopPropagation()} 
                className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Link>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(book.id); }} 
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de Paginación */}
      {!loading && books.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            disabled={!pagination.prev_page_url}
            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${
              pagination.prev_page_url
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Anterior
          </button>
          <span className="text-lg font-semibold text-gray-700">
            Página {pagination.current_page} de {pagination.last_page}
          </span>
          <button
            disabled={!pagination.next_page_url}
            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${
              pagination.next_page_url
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
      
      {isModalOpen && (
        <BookModal 
          isOpen={isModalOpen}
          book={selectedBook}
          onClose={closeModal}
          onEdit={(id) => {
            navigate(`/edit-book/${id}`);
            closeModal();
          }}
          onDelete={(id) => {
            handleDelete(id);
            closeModal();
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      <DeleteConfirmationModal 
        show={showDeleteModal} 
        onConfirm={confirmDelete} 
        onCancel={cancelDelete}
      />
    </div>
    

  );
};

export default BookList;