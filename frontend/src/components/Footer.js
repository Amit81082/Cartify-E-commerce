import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-slate-200'>
      <div className='container mx-auto p-4'>
       <p className='text-center font-bold' title='Cartify'>&copy; {new Date().getFullYear()} Shopping with Cartify.  All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
