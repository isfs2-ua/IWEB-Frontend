import axios from 'axios'

// 1. Pon tu API Key REAL aquí (la misma que usaste en el fetch que funcionó)
const API_KEY = import.meta.env.VITE_API_KEY

const api = axios.create({
  // Al usar '/api', la petición va a Vite -> Proxy -> http://localhost:8080/api
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  // Limpiamos cabeceras previas para evitar conflictos
  delete config.headers.Authorization

  const token = localStorage.getItem('token')

  // Lógica Simplificada:
  // Si hay token válido (usuario logueado), usamos Bearer
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Si NO hay token (usuario anónimo), usamos la API Key obligatoriamente
  else {
    config.headers.Authorization = `Api-Key ${API_KEY}`
  }

  // DEBUG: Para ver en la consola qué está enviando Axios realmente
  console.log(`[Axios] Request a: ${config.url}`)
  console.log(`[Axios] Header Auth: ${config.headers.Authorization}`)

  return config
})

export default api
