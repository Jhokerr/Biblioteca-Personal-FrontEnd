import { XMarkIcon, BookOpenIcon, CalendarIcon, DocumentIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const BookModal = ({ isOpen, book, onClose, onEdit, onDelete }) => {
  if (!isOpen || !book) return null;

  const placeholderCover = "https://via.placeholder.com/150x200.png?text=Sin+Portada";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>

        {/* Botón cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          
          {/* Portada - Lado Izquierdo */}
          <div className="md:w-2/5 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex flex-col justify-center items-center">
            <img 
              src={book.cover_url || placeholderCover}
              alt={book.title}
              className="rounded-xl shadow-lg max-h-96 object-cover border-2 border-indigo-200 hover:shadow-2xl transition-shadow duration-300"
            />
            
            {/* Rating o Estado Visual */}
            <div className="mt-6 w-full">
              {book.reading_status && (
                <div className="text-center">
                  <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                    book.reading_status === 'Leído' 
                      ? 'bg-green-100 text-green-700' 
                      : book.reading_status === 'Leyendo'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {book.reading_status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contenido - Lado Derecho */}
          <div className="md:w-3/5 p-8 flex flex-col justify-between">
            
            {/* Título y Autor */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {book.title}
              </h2>
              <p className="text-lg text-indigo-600 font-semibold mb-6">
                por {book.author}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
                {book.published_year && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-indigo-500" />
                    <span>{book.published_year}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-2">
                    <DocumentIcon className="h-5 w-5 text-purple-500" />
                    <span>{book.pages} páginas</span>
                  </div>
                )}
                {book.genre && (
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5 text-blue-500" />
                    <span>{book.genre}</span>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {book.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                    {book.description}
                  </p>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Link 
                to={`/books/${book.id}/edit`} 
                onClick={() => onEdit(book.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
           </Link>
              
              <button 
                onClick={() => onDelete(book.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;