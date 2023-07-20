import { Box, Typography, styled } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import { StyledLink } from './header'
import logoUrl from '../../assets/logo.svg'
import i18n from '../../i18n'
import tags from '../../../tags.json'

export const StyledFooter = styled('footer')(() => ({
  backgroundColor: '#000',
}))

export const Footer = () => {
  const navigate = useNavigate()

  return (
    <StyledFooter
      sx={{
        padding: '2rem 2rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          '@media (max-width: 1024px)': {
            flexDirection: 'column',
          },
        }}
      >
        <Box
          sx={{
            width: '25vw',

            '@media (max-width: 1024px)': {
              width: 'unset',
              marginBottom: '2rem',
              flexDirection: 'column',
            },
          }}
        >
          <StyledLink
            href='/'
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            <img src={logoUrl} alt='logo' />
            <Typography
              sx={{
                fontFamily: 'Quicksand',
                marginLeft: '0.5rem',
                fontSize: '1.5rem',
                color: '#fff',
              }}
            >
              Transgender.org
            </Typography>
          </StyledLink>
          <Typography
            variant='body1'
            sx={{
              marginTop: '1rem',
              fontSize: '1rem',
              color: '#fff',
            }}
          >
            {i18n.t('footer.description')}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant='body2'
            sx={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}
          >
            {i18n.t('header.menuitem.resources')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {tags
              .reduce(
                (acc, tag, i) => {
                  const column = Math.floor(i / 6)
                  acc[column] = acc[column] || []
                  acc[column].push(tag)
                  return acc
                },
                [] as (typeof tags)[],
              )
              .map((column, i) => (
                <Box
                  key={i}
                  sx={{
                    padding: i === 0 ? 0 : '0 0 0 2rem',
                    flexBasis: '25%',
                    flex: 1,

                    '@media (max-width: 650px)': {
                      padding: 0,
                      flex: 'unset',
                      flexBasis: '50%',
                    },
                  }}
                >
                  {column.map((tag, i) => (
                    <Typography
                      key={i}
                      variant='body1'
                      sx={{ color: '#fff', paddingBottom: '0.25rem' }}
                    >
                      <a
                        href={`/resources?tags=${tag.value}`}
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(`/resources?tags=${tag.value}`)
                          window.scrollTo(0, 0)
                        }}
                      >
                        {i18n.t(`tags.${tag.value}`)}
                      </a>
                    </Typography>
                  ))}
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Typography variant='body2' sx={{ color: '#fff', marginTop: '2rem', textAlign: 'center' }}>
        <a
          href='/terms-of-service'
          onClick={(e) => {
            e.preventDefault()
            navigate('/terms-of-service')
          }}
        >
          {i18n.t('footer.terms-of-service')}
        </a>{' '}
        |{' '}
        <a
          href='/privacy-policy'
          onClick={(e) => {
            e.preventDefault()
            navigate('/privacy-policy')
          }}
        >
          {i18n.t('footer.privacy-policy')}
        </a>{' '}
        | © 2023 Transgender.org
      </Typography>
    </StyledFooter>
  )
}
