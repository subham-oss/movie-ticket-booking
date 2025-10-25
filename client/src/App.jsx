import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import MyBookings from './pages/MyBookings'
import SeatLayout from './pages/SeatLayout'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import Addshows from './pages/admin/Addshows'
import ListShow from './pages/admin/ListShow'
import ListBooking from './pages/admin/ListBooking'
import { useAppContext } from '../context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'
const App = () => {
  const location = useLocation()
  const isadmin = location.pathname.startsWith('/admin');

  const {user} = useAppContext();
  console.log(isadmin)
  return (
    <>
    <Toaster/>
     {!isadmin && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/movies/:id' element={<MovieDetails/>}/>
        <Route path='/movies/:id/:date' element={<SeatLayout/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
    
      <Route path='/loading/:nextUrl' element={<Loading/>}/>
        <Route path='/favorites' element={<Favorite/>}/>
        <Route path='/admin/*' element={user ? <Layout/>:(
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
            <Route index element={<Dashboard/>}/>
            <Route path='add-shows' element={<Addshows/>}/>
            <Route path='list-shows' element={<ListShow/>}/>
            <Route path='list-bookings' element={<ListBooking/>}/>
        </Route>
      </Routes>
      {!isadmin && <Footer/>}
    </>
  )
}

export default App
