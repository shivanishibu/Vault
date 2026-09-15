import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from '../App'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/app" element={<ProtectedRoute><App /></ProtectedRoute>} /><Route path="*" element={<App />} /></Routes></BrowserRouter>
}
