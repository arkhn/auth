import { verify } from 'jsonwebtoken'
import { User } from '@prisma/client'

import { JWT_PUBLIC_KEY } from './constants'
import { Request } from 'express'

interface Token {
  user: User
  iat: number
}

export const getUser = async (request: Request): Promise<User | undefined> => {
  const Authorization = request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, JWT_PUBLIC_KEY, {
      algorithms: ['ES256'],
    }) as Token | null
    return verifiedToken?.user
  }
  return undefined
}
