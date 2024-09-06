import { Readable } from 'node:stream'
import fs from 'fs'
import { parse } from 'csv-parse'

class UploadCsv extends Readable {
  constructor(csvFilePath) {
    super()

    this.csvStream = fs
      .createReadStream(csvFilePath)
      .pipe(parse({ delimiter: ',', from_line: 2 }))

    this.csvIterator = this.csvStream[Symbol.asyncIterator]()
  }

  async _read() {
    try {
      const { value, done } = await this.csvIterator.next()

      if (done) {
        this.push(null)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const [title, description] = value
        const line = { title, description }

        console.log(line)

        const buf = Buffer.from(JSON.stringify(line))

        this.push(buf)
      }
    } catch (error) {
      this.destroy(error)
    }
  }
}

const csvFilePath = 'tasks.csv'

fetch('http://localhost:3333/tasks', {
  method: 'POST',
  body: new UploadCsv(csvFilePath),
  duplex: 'half',
})
