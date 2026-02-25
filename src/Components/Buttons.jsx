import React from 'react'

const Buttons = ({
    className,
    type,
    children

}) => {
  return (
    <div>
        <button className={className} type={type}>{children}</button>
    </div>
  )
}

export default Buttons