import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { validateFields } from './middlewares/validate-fiels.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      )

      return res.end(JSON.stringify(tasks))
    },
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const hasError = validateFields(req)

      if (hasError || !req.body.length) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'Provide valid fields!' }))
      }

      const taskList = req.body

      taskList.forEach((dataTask) => {
        const task = {
          id: randomUUID(),
          title: dataTask.title,
          description: dataTask.description,
          created_at: new Date(),
          completed_at: null,
          updated_at: null,
        }

        database.insert('tasks', task)
      })

      return res.writeHead(201).end()
    },
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const hasError = validateFields(req)

      if (hasError || !req.body.length) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'Provide valid fields!' }))
      }

      const { id } = req.params
      const { title, description } = req.body[0]

      const taskNotFound = database.update('tasks', id, {
        title,
        description,
        updated_at: new Date(),
      })

      if (taskNotFound) {
        res.writeHead(404).end(JSON.stringify({ message: 'Task not found!' }))
      } else {
        return res.writeHead(204).end()
      }
    },
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const taskNotFound = database.update('tasks', id, {
        completed_at: new Date(),
      })

      if (taskNotFound) {
        res.writeHead(404).end(JSON.stringify({ message: 'Task not found!' }))
      } else {
        return res.writeHead(204).end()
      }
    },
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const taskNotFound = database.delete('users', id)

      if (taskNotFound) {
        res.writeHead(404).end(JSON.stringify({ message: 'Task not found!' }))
      } else {
        return res.writeHead(204).end()
      }
    },
  },
]
