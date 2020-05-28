import { GraphQLServer, Options } from 'graphql-yoga'
import cors from 'cors'

import { schema } from './schema'
import { createContext } from './context'

const server = new GraphQLServer({
  schema,
  context: createContext,
})

server.express.use(cors())

const options: Options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  },
  bodyParserOptions: { limit: '10mb', type: 'application/json' },
}
const { PORT } = process.env

const main = async () => {
  await server.start(options, () =>
    console.log(
      `🚀 Server ready at: http://localhost:${PORT || 4000}
      \n⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️`,
    ),
  )
}

main()
