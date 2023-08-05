import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readdir = promisify(fs.readdir)

const inputDir = path.join(__dirname, '../resources')
const outputDir = path.join(__dirname, '../src/resources')
const languageFile = path.join(__dirname, '../languages.json')

const sanitizeUrl = (url: string) => {
  if (!url) return ''
  let sanitizedUrl = url.replace(/www./g, '') // remove 'www.'
  // remove protocol
  sanitizedUrl = sanitizedUrl.replace(/(^\w+:|^)\/\//, '')
  if (sanitizedUrl.endsWith('/')) {
    // remove trailing slash
    sanitizedUrl = sanitizedUrl.slice(0, -1)
  }
  return sanitizedUrl
}

const processJsonFiles = async () => {
  // Read the languages file
  const languagesContent = await readFile(languageFile, 'utf-8')
  const languages = [...JSON.parse(languagesContent), { language: 'English', locale_code: 'en-US' }]

  // Iterate over each language
  for (const language of languages) {
    const localeCode = language.locale_code

    // Get all the JSON files in the input directory
    const files = await readdir(inputDir)
    const jsonFiles = files.filter((file) => path.extname(file) === '.json')

    let output: any[] = []

    // Process each JSON file
    for (const file of jsonFiles) {
      // Read the file
      const content = await readFile(path.join(inputDir, file), 'utf-8')
      const data = JSON.parse(content)

      // Process the data with the external library
      if (data.i18n[localeCode]) {
        output.push({
          ...data,
          title: data.i18n[localeCode].title,
          description: data.i18n[localeCode].description,
        })

        // Remove i18n property from the output
        delete output[output.length - 1].i18n
      } else if (data.i18n['en-US']) {
        // fallback to english
        output.push({
          ...data,
          title: data.i18n['en-US'].title,
          description: data.i18n['en-US'].description,
        })
      }
    }

    // Write the processed data to the output directory
    const outputFilePath = path.join(outputDir, `${localeCode}.json`)

    // sort output based on list of most popular urls
    const popularUrls = [
      'transgendermap.com',
      'diyhrt.cafe',
      'genderdysphoria.fyi',
      'genderdiversity.org',
      'transfamilies.org',
      'translifeline.org',
      'glaad.org',
      'thetrevorproject.org',
      'hrc.org',
      'transfemscience.org',
      'genderspectrum.org',
      'transequality.org',
      'strandsfortrans.com',
    ]

    output = output.sort((a, b) => {
      const aUrl = sanitizeUrl(a.externalUrl)
      const bUrl = sanitizeUrl(b.externalUrl)

      if (popularUrls.includes(aUrl) && !popularUrls.includes(bUrl)) {
        return -1
      } else if (!popularUrls.includes(aUrl) && popularUrls.includes(bUrl)) {
        return 1
      } else {
        return 0
      }
    })

    await writeFile(outputFilePath, JSON.stringify(output, null, 2), 'utf-8')
  }
}

// Run the script
processJsonFiles().catch(console.error)

export {}
