import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import homeImageUrl from '../assets/home.jpg'
import { Button } from '../ui/button'
import i18n from '../i18n'

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${homeImageUrl}) no-repeat center center, #000`,
        backgroundSize: 'cover',
        minHeight: '100vh',

        '@media (max-width: 768px)': {
          padding: 0,
          justifyContent: 'flex-end',
          background: `url(${homeImageUrl}) no-repeat center center`,
          minHeight: 'calc(100vh - 85px)',
        },
      }}
    >
      <Box
        sx={{
          borderRadius: '8px',
          background: '#fff',
          width: 500,
          padding: '1rem 2rem',
          marginTop: '100px',
          marginLeft: '200px',

          '@media (max-width: 768px)': {
            width: 'unset',
            borderRadius: 0,
            marginTop: '2rem',
            marginLeft: 0,
          },
        }}
      >
        <Typography variant='h3'>{i18n.t('home.cta.title')}</Typography>
        <Typography variant='body2'>{i18n.t('home.cta.description')}</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '1rem',
          }}
        >
          {/* <Button onClick={() => navigate("/about")}>More About Us</Button>*/}
          <Button
            onClick={() => {
              window.open('https://discord.gg/CBmacvJfZK', '_blank')
            }}
          >
            {i18n.t('home.cta.discord-button')}
          </Button>
          <Button
            onClick={() => navigate('/resources')}
            sx={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
          >
            {i18n.t('home.cta.resources-button')}
          </Button>
          <Button
            onClick={() => window.open('https://forms.gle/sWGokyMXL92hRVYg8', '_blank')}
            sx={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
          >
            {i18n.t('home.cta.survey-button')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
