import React from 'react'

import { Box, SxProps } from '@mui/material'

export interface ButtonProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  sx?: SxProps
}

export const Button = ({ className, children, onClick, sx }: ButtonProps) => {
  return (
    <Box
      className={className}
      sx={{
        padding: '0.5rem 0.75rem',
        background: '#FF8787',
        fontFamily: 'Mukta, sans-serif',
        color: '#21242B',
        borderRadius: '24px',
        cursor: 'pointer',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  )
}
