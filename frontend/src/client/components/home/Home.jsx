import React from 'react'
import { Gallery } from './gallery/Gallery'
import { Carousel } from './carousel/Carousel'

export const Home = () => {
  return (
    <div className='min-h-screen bg-slate-800'>
      <Carousel/>
      <Gallery/>
    </div>
  )
}
