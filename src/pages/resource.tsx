import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { ReactComponent as ResultsLeft } from '../assets/results-left.svg'
import { ReactComponent as ResultsRight } from '../assets/results-right.svg'
import tags from '../../tags.json'
import organizationTypes from '../../organization-types.json'
import languages from '../../languages.json'

import { SearchInput } from '../ui/navigation/header'
import useSearch from '../hooks/useSearch'
import i18n from '../i18n'
import { usePagination } from '../hooks/usePagination'
import { Link } from '../ui/link'

export interface Resource {
  id: string
  slug: string
  externalUrl: string
  tags: string[]
  organizationType: string[]
  title: string
  description: string
  address: string
  phoneNumber?: string
  email?: string
  latLng: [number, number]
}

export interface PaginatorPageProps {
  currentPage: number
  offset: number
  maxPage: number
  setPage: (page: number) => void
}

export const PaginatorPage = ({ currentPage, offset, maxPage, setPage }: PaginatorPageProps) => {
  const page = currentPage < 3 ? currentPage + offset - (currentPage - 1) : currentPage + offset - 2

  return (
    <Box
      onClick={() => {
        if (page === currentPage || page > maxPage) {
          return
        }

        setPage(page)
      }}
      sx={{
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        cursor: page === currentPage ? 'not-allowed' : page > maxPage ? 'unset' : 'pointer',
      }}
    >
      {page <= maxPage && (
        <Typography variant='body1' sx={{ color: page === currentPage ? '#666666' : '#0D6EFD' }}>
          {page}
        </Typography>
      )}
    </Box>
  )
}

export const ResourcePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingResources, setIsLoadingResources] = React.useState(true)
  const [resources, setResources] = React.useState<Resource[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsRef = React.useRef<HTMLDivElement>(null)

  const queryTags = React.useMemo(
    () =>
      decodeURIComponent(searchParams.get('tags') ?? '')
        .split(',')
        .filter(Boolean) ?? [],
    [searchParams.get('tags')],
  )

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
      setIsLoadingResources(false)
    }

    void fetchResources()
  }, [])

  const { results, searchValue, setSearchValue } = useSearch<Resource>({
    defaultValue: searchParams.get('search') ?? '',
    dataSet: resources,
    keys: ['title', 'description', 'externalUrl'],
  })

  const filteredResources = React.useMemo(
    () =>
      results.filter(
        (result) =>
          queryTags.every((tag) => result.tags.includes(tag)) &&
          queryOrganizationTypes.every((type) =>
            result.organizationType.includes(type.toLowerCase()),
          ),
      ),
    [results, queryTags, queryOrganizationTypes],
  )

  const pageString = searchParams.get('page')

  const {
    canNavigateNext,
    canNavigatePrev,
    currentPage,
    currentPageData,
    maxPage,
    nextPage,
    prevPage,
    setPage,
  } = usePagination<Resource>(filteredResources, 20, pageString ? parseInt(pageString, 10) : 1)

  React.useEffect(() => {
    // reset page when search value changes or query tags change
    setPage(1)
  }, [searchValue, queryTags])

  React.useEffect(() => {
    // update page query param when page changes and not the first page
    if (currentPage > 1) {
      searchParams.set('page', currentPage.toString())

      setSearchParams(searchParams)
    } else {
      searchParams.delete('page')

      setSearchParams(searchParams)
    }
  }, [currentPage])

  React.useEffect(() => {
    if (pageString) {
      const parsedPage = parseInt(pageString, 10)

      setPage(parsedPage)
    }
  }, [pageString])

  const setPageAndScroll = (page: number) => {
    setPage(page)

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant='h3'>{i18n.t('header.menuitem.resources')}</Typography>
      <Typography variant='body2'>{i18n.t('resources.description')}</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '1rem',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '225px',
            minWidth: '225px',
            '@media (max-width: 768px)': {
              maxWidth: '100%',
              minWidth: '100%',
            },
          }}
        >
          <FormControl sx={{}} size='small'>
            <InputLabel sx={{ background: '#fff', fontFamily: 'Mukta, sans-serif' }}>
              {i18n.t('organization-types')}
            </InputLabel>
            <Select
              sx={{
                borderRadius: '24px',
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
              {organizationTypes.map((type, idx) => (
                <MenuItem key={idx} value={type.value}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              marginTop: '1rem',
            }}
            size='small'
          >
            <InputLabel
              sx={{
                background: '#fff',
                fontFamily: 'Mukta, sans-serif',
              }}
            >
              {i18n.t('tags')}
            </InputLabel>
            <Select
              sx={{
                borderRadius: '24px',
              }}
              onChange={(e) => {
                const value = e.target.value as unknown as string[]

                if (value.indexOf('') !== -1) {
                  searchParams.delete('tags')
                } else {
                  searchParams.set('tags', value.length ? value.join(',') : '')
                }

                setSearchParams(searchParams)
              }}
              value={queryTags}
              multiple
              fullWidth
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {tags.map((type, idx) => (
                <MenuItem key={idx} value={type.value}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          ref={resultsRef}
          sx={{
            marginLeft: '1.25rem',
            width: '100%',
            marginRight: '1rem',

            '@media (max-width: 768px)': {
              marginLeft: 0,
              marginTop: '1rem',
            },
          }}
        >
          <SearchInput
            sx={{
              width: 'auto',
            }}
            onChange={(e) => {
              if (!e.target.value) {
                searchParams.delete('search')
              } else {
                searchParams.set('search', e.target.value)
              }
              setSearchParams(searchParams)
              setSearchValue(e.target.value)
            }}
            defaultValue={searchValue}
          />
          <Typography variant='body1' sx={{ marginTop: '1rem' }}>
            {currentPageData.length} {i18n.t('resources.results')}
          </Typography>
          {currentPageData.map((result, i) => (
            <Box
              key={i}
              sx={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'row',
                paddingBottom: '1rem',
                borderBottom: '1px solid #E5E7EB',

                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  marginRight: '1rem',
                  '@media (max-width: 768px)': {
                    marginRight: 0,
                  },
                }}
              >
                <Typography
                  variant='body1'
                  sx={{
                    fontFamily: 'Mukta, sans-serif',
                    textDecoration: 'underline',
                    color: '#0D6EFD',
                    cursor: 'pointer',
                  }}
                >
                  <a href={result.externalUrl} target='_blank' rel='noreferrer'>
                    {result.title}
                  </a>
                </Typography>
                <Typography variant='body1' sx={{ marginTop: '0.5rem' }}>
                  {result.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  visibility:
                    ((result.address || result.phoneNumber || result.email) && 'visible') ||
                    'hidden',

                  '@media (max-width: 768px)': {
                    marginTop: '1rem',
                    display:
                      ((result.address || result.phoneNumber || result.email) && 'block') || 'none',
                  },
                }}
              >
                <Typography variant='body1' fontWeight={500}>
                  Contact
                </Typography>
                <Typography variant='body1' sx={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  <div itemProp='address' itemScope itemType='http://schema.org/PostalAddress'>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        result.address,
                      )}`}
                      target='_blank'
                      itemProp='address'
                    >
                      {result.address}
                    </Link>
                  </div>
                </Typography>
                {result.phoneNumber && (
                  <Typography variant='body1' sx={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <Link href={`tel:${result.phoneNumber}`} itemProp='telephone'>
                      {result.phoneNumber}
                    </Link>
                  </Typography>
                )}
                {result.email && (
                  <Typography variant='body1' sx={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <Link href={`mailto:${result.email}`} itemProp='email'>
                      {result.email}
                    </Link>
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
          <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '1rem' }}>
            <Box
              onClick={() => {
                if (!canNavigatePrev) return

                prevPage()
                resultsRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                cursor: canNavigatePrev ? 'pointer' : 'not-allowed',

                '& path': {
                  fill: canNavigatePrev ? '#0D6EFD' : '#666666',
                },
              }}
            >
              <ResultsLeft />
            </Box>
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={0}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={1}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={2}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={3}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={4}
            />
            <Box
              onClick={() => {
                if (!canNavigateNext) return

                nextPage()
                resultsRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                cursor: canNavigateNext ? 'pointer' : 'not-allowed',

                '& path': {
                  fill: canNavigateNext ? '#0D6EFD' : '#666666',
                },
              }}
            >
              <ResultsRight />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '1.25rem',
              }}
            >
              {!!currentPageData.length && `${(currentPage - 1) * 20 + 1}-`}
              {(currentPage - 1) * 20 + currentPageData.length} of {filteredResources.length}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
