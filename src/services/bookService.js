import axiosInstance from '../config/axios';

// Servicio para manejar todas las operaciones del CRUD de libros
const bookService = {
  // Obtener todos los libros
  getAllBooks: async () => {
    try {
      const response = await axiosInstance.get('/books');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener libros' 
      };
    }
  },

  // Obtener un libro por ID
  getBook: async (id) => {
    try {
      const response = await axiosInstance.get(`/books/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener el libro' 
      };
    }
  },

  // Crear un nuevo libro
  createBook: async (bookData) => {
    try {
      const response = await axiosInstance.post('/books', bookData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear el libro' 
      };
    }
  },

  // Actualizar un libro
  updateBook: async (id, bookData) => {
    try {
      const response = await axiosInstance.put(`/books/${id}`, bookData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar el libro' 
      };
    }
  },

  // Eliminar un libro
  deleteBook: async (id) => {
    try {
      await axiosInstance.delete(`/books/${id}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar el libro' 
      };
    }
  },
};

export default bookService;