export async function json(req, res) {
  const parsedBuffers = []

  try {
    for await (const chunk of req) {
      parsedBuffers.push(JSON.parse(chunk))
    }

    req.body = parsedBuffers
  } catch (error) {
    console.error('JSON Parse Error:', error)
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
}
