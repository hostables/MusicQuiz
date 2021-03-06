import React from 'react'
import './ScreenBar.css'
import '../../variables.css'

const ScreenBar = ({ children, backgroundColor, className }) => (
  <div
    className={className ? `ScreenBar ${className}` : 'ScreenBar'}
    style={{backgroundColor: backgroundColor}}
  >
    {children}
  </div>
)

ScreenBar.defaultProps = {
  backgroundColor: 'var(--primary)',
  parentClass: ""
}

export default ScreenBar
