import { readJSON, writeJSON, hashPassword } from './storage'

// დემო „ბექენდი“: მომხმარებლები ბრაუზერის localStorage-ში ინახება, პაროლი — SHA-256 ჰეშით
const KEY = 'tao-users'
const all = () => readJSON(KEY, {})
const publicUser = ({ hash: _hash, ...u }) => u

export async function register({ firstName, lastName, email, username, password }) {
  const users = all()
  const mail = email.trim().toLowerCase()
  if (users[mail]) throw new Error('email')
  if (Object.values(users).some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) throw new Error('username')
  const user = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: mail,
    username: username.trim(),
    goal: '',
    createdAt: new Date().toISOString(),
    hash: await hashPassword(password),
  }
  writeJSON(KEY, { ...users, [mail]: user })
  return publicUser(user)
}

export async function login(identifier, password) {
  const id = identifier.trim().toLowerCase()
  const user = Object.values(all()).find((u) => u.email === id || u.username.toLowerCase() === id)
  if (!user || user.hash !== (await hashPassword(password))) throw new Error('credentials')
  return publicUser(user)
}

export function updateUser(email, patch) {
  const users = all()
  if (!users[email]) return null
  users[email] = { ...users[email], ...patch }
  writeJSON(KEY, users)
  return publicUser(users[email])
}
