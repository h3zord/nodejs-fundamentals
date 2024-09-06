import http from 'node:http'

const server = http.createServer(async (req, res) => {
  for await (const record of req) {
    console.log(JSON.parse(record))
  }

  res.end('Finished processing CSV\n')
})

server.listen(3333, () => console.log('Running...'))
