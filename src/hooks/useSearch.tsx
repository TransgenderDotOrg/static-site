import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'

interface IUseSearchProps<T> {
  dataSet: T[]
  keys: string[]
  defaultValue?: string
}

const SCORE_THRESHOLD = 0.4

export default function useSearch<T>({ dataSet, keys, defaultValue }: IUseSearchProps<T>) {
  const [searchValue, setSearchValue] = useState(defaultValue)

  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      keys,
    }

    return new Fuse(dataSet, options)
  }, [dataSet, keys])

  const results = useMemo(() => {
    if (!searchValue) return dataSet

    const searchResults = fuse.search(searchValue)

    return searchResults
      .filter(
        (fuseResult: Fuse.FuseResult<T>) => fuseResult.score && fuseResult.score < SCORE_THRESHOLD,
      )
      .map((fuseResult) => fuseResult.item)
  }, [fuse, searchValue, dataSet])

  return {
    searchValue,
    setSearchValue,
    results,
  }
}
