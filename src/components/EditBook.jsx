// src/components/EditBook.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PencilSquareIcon } from '@heroicons/react/24/solid';

const EditBook = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [book, setBook] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        published_year: '',
        pages: '',
        cover_url: '',
        reading_status: 'Por Leer',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const genres = ["Ficción", "No Ficción", "Ciencia Ficción", "Fantasía", "Misterio", "Romance", "Thriller", "Biografía", "Historia", "Otro"];
    const readingStatuses = ["Por Leer", "Leyendo", "Leído"];

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/books/${id}`)
            .then(response => {
                setBook({
                    title: response.data.title || '',
                    author: response.data.author || '',
                    description: response.data.description || '',
                    genre: response.data.genre || '',
                    published_year: response.data.published_year || '',
                    pages: response.data.pages || '',
                    cover_url: response.data.cover_url || '',
                    reading_status: response.data.reading_status || 'Por Leer',
                });
            })
            .catch(err => {
                console.error('Error fetching book:', err);
                setError('No se pudo cargar el libro. Intenta de nuevo.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        axios.put(`http://localhost:8000/api/books/${id}`, book)
            .then(() => {
                navigate('/');
            })
            .catch(err => {
                console.error('Error saving book:', err);
                setError('Hubo un error al guardar el libro. Verifica los datos.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out border border-indigo-700">
            <div className="flex items-center justify-center space-x-3 text-white mb-6">
                <PencilSquareIcon className="h-10 w-10" />
                <h2 className="text-4xl font-extrabold tracking-wide">
                    Editar Libro
                </h2>
            </div>
            
            {loading && (
                <div className="text-center text-white text-lg mb-4">Cargando...</div>
            )}
            {error && (
                <div className="bg-red-200 text-red-800 p-3 rounded-md mb-4 text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campos de Título y Autor */}
                <div>
                    <label htmlFor="title" className="block text-white text-lg font-semibold mb-2">Título</label>
                    <input type="text" id="title" name="title" value={book.title} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 transition duration-200" placeholder="Escribe el título del libro" required />
                </div>
                <div>
                    <label htmlFor="author" className="block text-white text-lg font-semibold mb-2">Autor</label>
                    <input type="text" id="author" name="author" value={book.author} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 transition duration-200" placeholder="Escribe el autor del libro" required />
                </div>
                
                {/* Nuevos campos de formulario */}
                <div>
                    <label htmlFor="description" className="block text-white text-lg font-semibold mb-2">Descripción</label>
                    <textarea id="description" name="description" value={book.description} onChange={handleChange} rows="4" className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 transition duration-200" placeholder="Escribe una breve descripción del libro"></textarea>
                </div>
                <div>
                    <label htmlFor="genre" className="block text-white text-lg font-semibold mb-2">Género</label>
                    <select id="genre" name="genre" value={book.genre} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 transition duration-200">
                        <option value="">Selecciona un género</option>
                        {genres.map(genre => (<option key={genre} value={genre}>{genre}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="published_year" className="block text-white text-lg font-semibold mb-2">Año de Publicación</label>
                    <input type="number" id="published_year" name="published_year" value={book.published_year} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 transition duration-200" placeholder="Ej: 2023" />
                </div>
                <div>
                    <label htmlFor="pages" className="block text-white text-lg font-semibold mb-2">Número de Páginas</label>
                    <input type="number" id="pages" name="pages" value={book.pages} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 transition duration-200" placeholder="Ej: 350" />
                </div>
                <div>
                    <label htmlFor="cover_url" className="block text-white text-lg font-semibold mb-2">URL de la Portada</label>
                    <input type="url" id="cover_url" name="cover_url" value={book.cover_url} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 placeholder-gray-500 transition duration-200" placeholder="Ej: https://ejemplo.com/portada.jpg" />
                </div>
                <div>
                    <label htmlFor="reading_status" className="block text-white text-lg font-semibold mb-2">Estado de Lectura</label>
                    <select id="reading_status" name="reading_status" value={book.reading_status} onChange={handleChange} className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 bg-white bg-opacity-90 transition duration-200">
                        {readingStatuses.map(status => (<option key={status} value={status}>{status}</option>))}
                    </select>
                </div>
                <button type="submit" className="w-full bg-yellow-400 text-indigo-900 py-3 rounded-lg font-extrabold text-xl shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:-translate-y-1" disabled={loading}>
                    {loading ? 'Guardando...' : 'Actualizar Libro'}
                </button>
            </form>
        </div>
    );
};

export default EditBook;