export function validateFields(req) {
  const fieldList = req.body

  for (const dataTask of fieldList) {
    const { title, description } = dataTask

    try {
      if (!title || !description) {
        throw new Error('Provide valid fields!')
      }
    } catch (error) {
      console.error('Validate Fields:', error)

      return !!error
    }
  }
}
