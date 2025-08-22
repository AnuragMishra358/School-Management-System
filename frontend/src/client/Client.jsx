import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './utility components/navbar/Navbar'
import { Footer } from './utility components/footer/Footer'

export const Client = () => {
  return (

    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  
  )
}
