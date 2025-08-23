import React from 'react'
import { Gallery } from './gallery/Gallery'
import { Carousel } from './carousel/Carousel'

export const Home = () => {
  return (
    <div className='min-h-screen'>
      <Carousel/>
      <Gallery/>
    </div>
  )
}
