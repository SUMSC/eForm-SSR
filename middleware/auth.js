import { getServerToken, getToken } from '~/utils/cookies'

export default function (context) {
  const { req } = context
  let token
  if (process.server) {
    token = getServerToken(req)
  } else {
    token = getToken()
  }
  context.store.commit('setToken', token)
}
