import { objectType, FieldResolver } from '@nexus/schema'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { JWT_SIGNING_KEY } from '../constants'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()

    t.model.email()
    t.model.name()
    t.model.role()

    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const login: FieldResolver<'Mutation', 'login'> = async (
  _parent,
  { email, password },
  ctx,
) => {
  const user = await ctx.prisma.user.findOne({
    where: {
      email,
    },
  })
  if (!user) {
    throw new Error(`No user found for email: ${email}`)
  }
  const passwordValid = await compare(password, user.password)
  if (!passwordValid) {
    throw new Error('Invalid password')
  }

  return {
    token: sign({ user }, JWT_SIGNING_KEY, { algorithm: 'ES256' }),
    user,
  }
}

export const signup: FieldResolver<'Mutation', 'signup'> = async (
  _parent,
  { name, email, password },
  ctx,
) => {
  const hashedPassword = await hash(password, 10)
  const user = await ctx.prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return {
    token: sign({ user }, JWT_SIGNING_KEY, { algorithm: 'ES256' }),
    user,
  }
}
