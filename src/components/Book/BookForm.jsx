// src/components/BookForm.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Swal from "sweetalert2";
import { PencilSquareIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    published_year: "",
    pages: "",
    cover_url: "",
    reading_status: "Por Leer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const genres = [
    "Ficción",
    "No Ficción",
    "Ciencia Ficción",
    "Fantasía",
    "Misterio",
    "Romance",
    "Thriller",
    "Biografía",
    "Historia",
    "Otro",
  ];

  const readingStatuses = ["Por Leer", "Leyendo", "Leído"];

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosInstance
        .get(`/books/${id}`)
        .then((res) => {
          const data = res.data;
          setBook({
            title: data.title || "",
            author: data.author || "",
            description: data.description || "",
            genre: data.genre || "",
            published_year: data.published_year || "",
            pages: data.pages || "",
            cover_url: data.cover_url || "",
            reading_status: data.reading_status || "Por Leer",
          });
        })
        .catch(() => setError("No se pudo cargar el libro. Intenta de nuevo."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const currentYear = new Date().getFullYear();
    if (
      book.published_year &&
      (book.published_year < 1000 || book.published_year > currentYear)
    ) {
      return setError("El año de publicación no es válido.");
    }
    if (book.pages && book.pages <= 0) {
      return setError("El número de páginas debe ser mayor que cero.");
    }
    if (
      book.cover_url &&
      !book.cover_url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
    ) {
      return setError("La URL de la portada debe ser una imagen válida.");
    }

    setLoading(true);
    const apiCall = id
      ? axiosInstance.put(`/books/${id}`, book)
      : axiosInstance.post("/books", book);

    apiCall
      .then(() => {
        Swal.fire({
          icon: "success",
          title: id ? "Libro actualizado" : "Libro añadido",
          showConfirmButton: false,
          timer: 1500,
          background: "#1f1b4d",
          color: "#fff",
        });
        navigate("/");
      })
      .catch(() =>
        setError("Hubo un error al guardar el libro. Verifica los datos.")
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-8">
      {/* Botón regresar */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver al inicio
        </Link>
      </div>

      {/* Título */}
      <div className="flex items-center justify-center space-x-3 text-indigo-900 mb-8">
        {id ? (
          <PencilSquareIcon className="h-10 w-10" />
        ) : (
          <PlusIcon className="h-10 w-10" />
        )}
        <h2 className="text-4xl font-bold tracking-wide">
          {id ? "Editar Libro" : "Añadir Nuevo Libro"}
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6 text-center font-semibold">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-indigo-700 text-lg mb-6">Cargando...</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primera fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
              placeholder="Ej: El nombre del viento"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Autor
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
              placeholder="Ej: Patrick Rothfuss"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-gray-800 text-lg font-semibold mb-2"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleChange}
            rows="4"
            placeholder="Escribe una breve sinopsis o descripción..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          ></textarea>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="genre"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Género
            </label>
            <select
              id="genre"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            >
              <option value="">Selecciona un género</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="published_year"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Año
            </label>
            <input
              type="number"
              id="published_year"
              name="published_year"
              value={book.published_year}
              onChange={handleChange}
              placeholder="Ej: 2023"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="pages"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Páginas
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={book.pages}
              onChange={handleChange}
              placeholder="Ej: 450"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Portada */}
        <div>
          <label
            htmlFor="cover_url"
            className="block text-gray-800 text-lg font-semibold mb-2"
          >
            URL de la Portada
          </label>
          <input
            type="url"
            id="cover_url"
            name="cover_url"
            value={book.cover_url}
            onChange={handleChange}
            placeholder="https://ejemplo.com/portada.jpg"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          {book.cover_url && (
            <div className="flex justify-center mt-4">
              <img
                src={book.cover_url}
                alt="Previsualización de la portada"
                className="w-48 h-64 object-cover rounded-xl shadow-lg border-4 border-indigo-400"
              />
            </div>
          )}
        </div>

        {/* Estado de lectura */}
        <div>
          <label
            htmlFor="reading_status"
            className="block text-gray-800 text-lg font-semibold mb-2"
          >
            Estado de Lectura
          </label>
          <select
            id="reading_status"
            name="reading_status"
            value={book.reading_status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          >
            {readingStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-70 transition-all duration-300 transform hover:-translate-y-1"
        >
          {loading
            ? "Guardando..."
            : id
            ? "Actualizar Libro"
            : "Añadir Libro"}
        </button>
      </form>
    </div>
  );
};

export default BookForm;
