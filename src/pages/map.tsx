import React from 'react'
import { useSearchParams } from 'react-router-dom'
import GoogleMapReact from 'google-map-react'
import {
  Box,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { Resource } from './resource'
import i18n from '../i18n'
import languages from '../../languages.json'
import { ReactComponent as MarkerIcon } from '../assets/marker.svg'
import { Link } from '../ui/link'
import organizationTypes from '../../organization-types.json'

export interface MarkerProps {
  lat: number
  lng: number
  resource: Resource
}

const mapOrganizationTypes = organizationTypes.filter(
  (organizationType) => organizationType.canHavePhysicalAddress,
)

export const Marker = (props: MarkerProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | Element>(null)

  return (
    <>
      <div style={{ position: 'relative' }}>
        <MarkerIcon
          onClick={(e) => setAnchorEl(e.currentTarget)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 'calc(50% - 10px)',
            cursor: 'pointer',
          }}
        />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          sx: {
            padding: '0.5rem',
          },
        }}
        slotProps={{
          root: {
            sx: {
              padding: 0,
            },
          },
          paper: {
            sx: {
              width: '300px',
            },
          },
        }}
      >
        <Typography variant='body1' sx={{ fontSize: '0.65rem' }} fontWeight={500}>
          {props.resource.externalUrl ? (
            <Link href={props.resource.externalUrl}>{props.resource.title}</Link>
          ) : (
            props.resource.title
          )}
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
          {props.resource.description}
        </Typography>
        <Typography
          variant='body1'
          fontWeight={500}
          sx={{ fontSize: '0.65rem', marginTop: '0.5rem' }}
        >
          Contact
        </Typography>
        <Typography variant='body1' sx={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
          <div itemProp='address' itemScope itemType='http://schema.org/PostalAddress'>
            {props.resource.address}
          </div>
        </Typography>
        {props.resource.phoneNumber && (
          <Typography variant='body1' sx={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
            <Link href={`tel:${props.resource.phoneNumber}`} itemProp='telephone'>
              {props.resource.phoneNumber}
            </Link>
          </Typography>
        )}
        {props.resource.email && (
          <Typography variant='body1' sx={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>
            <Link href={`mailto:${props.resource.email}`} itemProp='email'>
              {props.resource.email}
            </Link>
          </Typography>
        )}
      </Menu>
    </>
  )
}

export const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [resources, setResources] = React.useState<Resource[]>([])

  const queryOrganizationTypes = React.useMemo(
    () =>
      decodeURIComponent(searchParams.get('organizationTypes') ?? '')
        .split(',')
        .filter(Boolean) ?? [],
    [searchParams.get('organizationTypes')],
  )

  React.useEffect(() => {
    const fetchResources = async () => {
      // eslint-disable-next-line camelcase
      const pickedLanguage = [...languages, { locale_code: 'en-US' }].find(
        (l) => l.locale_code === i18n.language,
      )

      const { default: resources } = await import(
        `../resources/${pickedLanguage?.locale_code}.json`
      )

      const resourcesArray: Resource[] = Object.values(resources)

      setResources(resourcesArray)
    }

    void fetchResources()
  }, [])

  const filteredResources = React.useMemo(
    () =>
      resources.filter((resource) =>
        queryOrganizationTypes.every((type) =>
          resource.organizationType.includes(type.toLowerCase()),
        ),
      ),
    [resources, queryOrganizationTypes],
  )

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 85px)',
      }}
    >
      <GoogleMapReact
        options={{
          fullscreenControl: false,
        }}
        bootstrapURLKeys={{
          key: process.env.GOOGLE_MAPS_API_KEY ?? '',
        }}
        center={{
          lat: 0,
          lng: 0,
        }}
        defaultZoom={1}
      >
        {filteredResources
          .filter((resource) => resource.latLng)
          .map((resource, i) => (
            <Marker key={i} lat={resource.latLng[0]} lng={resource.latLng[1]} resource={resource} />
          ))}
      </GoogleMapReact>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          opacity: 0.85,
          background: '#fff',
        }}
      >
        <FormControl
          sx={{
            maxWidth: '250px',
            minWidth: '250px',

            '@media (max-width: 768px)': {
              maxWidth: '100%',
              minWidth: '100%',
            },
          }}
          size='small'
        >
          <InputLabel
            sx={{
              background: '#fff',
              fontFamily: 'Mukta, sans-serif',
            }}
          >
            {i18n.t('organization-types')}
          </InputLabel>
          <Select
            sx={{
              borderRadius: '24px',
              fontWeight: '600',
            }}
            onChange={(e) => {
              const value = e.target.value as unknown as string[]

              if (value.indexOf('') !== -1) {
                searchParams.delete('organizationTypes')
              } else {
                searchParams.set('organizationTypes', value.length ? value.join(',') : '')
              }

              setSearchParams(searchParams)
            }}
            value={queryOrganizationTypes}
            multiple
            fullWidth
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {mapOrganizationTypes.map((type, index) => (
              <MenuItem key={index} value={type.value}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}
