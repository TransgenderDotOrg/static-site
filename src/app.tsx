import styled from '@emotion/styled'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import './normalize.css'
import './style.css'
import { ThemeProvider, createTheme } from '@mui/material'
import { Header } from './ui/navigation/header'
import { HomePage } from './pages/home'
import { ResourcePage } from './pages/resource'

import i18n from './i18n'
import { Footer } from './ui/navigation/footer'
import { TermsOfServicePage } from './pages/terms-of-service'
import { PrivacyPolicyPage } from './pages/privacy-policy'
import { MapPage } from './pages/map'

export const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'var(--bg-pink-gradient)',
  minHeight: '100vh',
})

export const AppLogo = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100px',

  '& img': {
    height: '100%',
  },
  '& h1': {
    marginLeft: '1rem',
    color: 'white',
  },
})

export const Card = styled('div')({
  backgroundColor: '#fff',
  borderRadius: '10px',
  backdropFilter: 'blur(5px)',
  '-webkit-backdrop-filter': 'blur(15px)',
  boxShadow: 'var(--standard-shadow)',
})

export const Menu = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  background: 'var(--accent-1a)',
  height: '30px',
  borderRadius: '10px 10px 0 0',
  '& a': {
    background: '1px solid var(--accent-1a)',
    border: '1px solid #fff',
    borderWidth: '0 1px',
    whiteSpace: 'nowrap',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    padding: '0 1rem',
    '&:hover': {
      background: 'var(--accent-2a)',
      color: '#fff',
    },
    '& img': {
      height: '100%',
    },
  },
})

export interface MenuItemProps {
  title: string
  href: string
  position?: 'bottom' | 'right'
  children?: React.ReactNode
}

export const MenuContainer = styled('a')({
  '& > .children': {
    display: 'none',
  },

  '&:hover > .children': {
    display: 'block',
  },
})

export const MenuItem = ({ href, title, children, position = 'right' }: MenuItemProps) => {
  return (
    <MenuContainer href={href} style={{ position: 'relative' }}>
      {title}

      {children && (
        <div
          className='children'
          style={{
            position: 'absolute',
            left: position === 'bottom' ? -1 : '100%',
            top: position === 'bottom' ? '100%' : 0,
            minWidth: 'calc(100% + 2px)',
          }}
        >
          {children}
        </div>
      )}
    </MenuContainer>
  )
}

const theme = createTheme({
  typography: {
    body1: {
      fontFamily: 'Catamaran, sans-serif',
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: 'Catamaran, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 300,
      lineHeight: 1.5,
    },
    h3: {
      fontFamily: 'Mukta, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontFamily: 'Mukta, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
})

const App = () => {
  document.body.dir = i18n.dir()

  return (
    <>
      <ThemeProvider theme={theme}>
        <Helmet>
          <title>{i18n.t('meta.title')}</title>
          <meta name='description' content={i18n.t('meta.description')} />
        </Helmet>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path='/' element={<HomePage />} />
            {/* <Route path="about" element={<AboutPage />} />*/}
            <Route path='resources' element={<ResourcePage />} />
            <Route path='terms-of-service' element={<TermsOfServicePage />} />
            <Route path='privacy-policy' element={<PrivacyPolicyPage />} />
            <Route path='map' element={<MapPage />} />
            <Route path='*' element={<HomePage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
