import { queryType } from '@nexus/schema'
import { User } from '@prisma/client'
import { verify } from 'jsonwebtoken'

import { JWT_PUBLIC_KEY } from '../constants'

interface Token {
  user: User
  iat: number
}

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: async (_, __, ctx) => {
        const Authorization = ctx.request.get('Authorization')
        if (Authorization) {
          const token = Authorization.replace('Bearer ', '')
          const verifiedToken = verify(token, JWT_PUBLIC_KEY, {
            algorithms: ['ES256'],
          }) as Token | null

          if (!verifiedToken) return null
          return verifiedToken.user
        }
        return null
      },
    })
  },
})
