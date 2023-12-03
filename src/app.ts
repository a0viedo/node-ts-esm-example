import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'

const server: FastifyInstance = Fastify({
  logger: true
})

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'ok' }
})

const start = async () => {
  try {
    await server.listen({ port: 3000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

await start()

process.on('exit', (code) => {
  server.log.info(`Server restarting. Code:${code}`)
});

// this is the signal that nodemon uses
process.once('SIGUSR2', () => {
  server.log.info('Server restarting')
  process.kill(process.pid, 'SIGUSR2')
});