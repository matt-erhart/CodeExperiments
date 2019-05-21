import fs = require('fs-extra')
import path = require('path')
import glob = require('glob')
import cheerio = require('cheerio')
interface FileInfo {
  fullFilePath: string
  fileNameWithExt: string
}

export const listXml = (fullPath: string): Promise<FileInfo[]> =>
  new Promise(resolve => {
    glob(fullPath + '/*.xml', { nodir: true }, (err, files) => {
      const fileInfo = files.map(f => {
        return {
          fullFilePath: f,
          fileNameWithExt: path.basename(f),
        }
      })
      resolve(fileInfo)
    })
  })

const procXml = async () => {
  const xmls = await listXml('F:\\grobid\\tei')
  let outString = ''   
  for (let xmlFile of xmls) {
    const xml = await fs.readFile(xmlFile.fullFilePath, 'utf8')
    const $ = cheerio.load(xml)
    const title = $("title[type='main']")
      .first()
      .text()
    console.log('title: ', title)
    outString += title + '\n'
  }
  await fs.writeFile('F:\\CodeExperiments\\src\\test.txt', outString)
}
procXml()
