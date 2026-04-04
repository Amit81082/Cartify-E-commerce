import React from 'react'

import cartify from '../assest/cartify.png'

const Logo = ({w,h}) => {
  return (
    <img src={cartify} alt='logo' width={w} height={h} />

  )
}

export default Logo
