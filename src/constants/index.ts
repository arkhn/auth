const { JWT_PRIVATE_KEY: priv, JWT_PUBLIC_KEY: pub } = process.env
if (!priv) {
  throw new Error('MISSING "JWT_PRIVATE_KEY" in environment variables')
}
if (!pub) {
  throw new Error('MISSING "JWT_PUBLIC_KEY" in environment variables')
}
export const JWT_SIGNING_KEY = priv.replace(/\\n/g, '\n')
export const JWT_PUBLIC_KEY = pub.replace(/\\n/g, '\n')
