import React from 'react'

const Buttons = ({
    className,
    type,
    children,
    ...props

}) => {
  return (
    <div>
        <button className={className} type={type} {...props}>{children}</button>
    </div>
  )
}

export default Buttons