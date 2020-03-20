import Cookies from 'js-cookie'

const tokenKey = 'Authorization'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = token => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)
export const getServerToken = (req) => {
  const { cookie } = req.headers
  const res = /Authorization=(.+?)$/g.exec(cookie)
  return res ? res[1].split(';')[0] : ''
}
