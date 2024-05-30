import axios from 'axios'
import { useUserStore } from 'src/stores/user.js'
import cryptoJs from 'crypto-js'
import { useRouter } from 'vue-router'

const api = axios.create({ baseURL: process.env.VITE_API }) // 公司測試專用
const apiAuth = axios.create({ baseURL: process.env.VITE_API + 'api/' })
const apiFuck = axios.create({ baseURL: process.env.VITE_API + 'backend/' })
const apiShit = axios.create({ baseURL: process.env.Fetch_api }) // 專用
const apiOpay = axios.create({ baseURL: process.env.opay_api })
const apiOrder = axios.create({ baseURL: process.env.apiOrder })
// const giveMe = axios.create({ baseURL: process.env.giveMe })
const giveMe = axios.create({
  baseURL: 'https://www.giveme.com.tw/', // 示例 baseURL
  headers: {
    'Content-Type': 'application/json'
  }
})
const apiPay = axios.create({ baseURL: process.env.funpoint_api })
apiAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.authorization = 'Bearer ' + user.tokens
  return config
})
apiShit.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.authorization = 'Bearer ' + user.tokenslimit
  return config
})
// apiAuth.interceptors.response.use (成功時的 function, 失敗時的 function)
apiAuth.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    // 如果失敗的請求有回應
    if (error.response) {
      // 如果失敗的請求回應是 401，可能是 JWT 驗證失敗
      if (error.response.status === 401) {
        // 確認請求的網址不是延長登入、登入、登出
        if (
          !['/users/extend', '/users/login', '/users/logout'].includes(
            error.config.url
          )
        ) {
          const user = useUserStore()
          // 傳送延長登入請求
          return apiAuth
            .patch('/users/extend')
            .then(({ data }) => {
              // 更新 user store 的 JWT
              user.token = data.result
              // 修改原請求的 JWT
              error.config.headers.authorization = 'Bearer ' + user.tokens
              // 重新傳送原請求
              return axios(error.config)
            })
            .catch((_) => {
              // 重新登入失敗，強制登出
              user.logout()
              // 回傳原本的錯誤到呼叫的地方
              return Promise.reject(error)
            })
        }
      }
    }
    // 如果失敗的請求沒回應，回傳原本的錯誤到呼叫的地方
    return Promise.reject(error)
  }
)
apiShit.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    // 如果失敗的請求有回應
    if (error.response) {
      // 如果失敗的請求回應是 401，可能是 JWT 驗證失敗
      if (error.response.status === 401) {
        // 確認請求的網址不是延長登入、登入、登出
        if (
          !['/login/extend', '/login/login', '/login/logout'].includes(
            error.config.url
          )
        ) {
          const user = useUserStore()
          // 傳送延長登入請求
          return apiAuth
            .patch('/login/extend')
            .then(({ data }) => {
              // 更新 user store 的 JWT
              user.tokenslimit = data.result.token
              // 修改原請求的 JWT
              error.config.headers.authorization = 'Bearer ' + user.tokenslimit
              // 重新傳送原請求
              return axios(error.config)
            })
            .catch((_) => {
              // 重新登入失敗，強制登出
              user.logout()
              // 回傳原本的錯誤到呼叫的地方
              return Promise.reject(error)
            })
        }
      }
    }
    useRouter().push('/')
    // 如果失敗的請求沒回應，回傳原本的錯誤到呼叫的地方
    return Promise.reject(error)
  }
)
// apiAuth.interceptors.response.use (成功時的 function, 失敗時的 function)

apiFuck.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.authorization = 'Bearer ' + user.tokens
  return config
})

// apiAuth.interceptors.response.use (成功時的 function, 失敗時的 function)
apiFuck.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    // 如果失敗的請求有回應
    if (error.response) {
      // 如果失敗的請求回應是 401，可能是 JWT 驗證失敗
      if (error.response.status === 401) {
        // 確認請求的網址不是延長登入、登入、登出
        if (
          !['/users/extend', '/users/login', '/users/logout'].includes(
            error.config.url
          )
        ) {
          const user = useUserStore()
          // 傳送延長登入請求
          return apiAuth
            .patch('/users/extend')
            .then(({ data }) => {
              // 更新 user store 的 JWT
              user.token = data.result
              // 修改原請求的 JWT
              error.config.headers.authorization = 'Bearer ' + user.tokens
              // 重新傳送原請求
              return axios(error.config)
            })
            .catch((_) => {
              // 重新登入失敗，強制登出
              user.logout()
              // 回傳原本的錯誤到呼叫的地方
              return Promise.reject(error)
            })
        }
      }
    }
    // 如果失敗的請求沒回應，回傳原本的錯誤到呼叫的地方
    return Promise.reject(error)
  }
)

apiOpay.interceptors.request.use((config) => {
  // 確保請求數據是一個對象
  // 只加密 Data 部分
  if (config.data.Data) {
    // 將 Data 部分轉換為 JSON 字符串（如果它還不是字符串）
    const dataString = JSON.stringify(config.data.Data)
    // URL 編碼
    // console.log('datastring', dataString)
    const body = encodeURIComponent(dataString)
    // 定義密鑰和 IV
    const key = cryptoJs.enc.Utf8.parse('ejCk326UnaZWKisg')
    const iv = cryptoJs.enc.Utf8.parse('q9jcZX8Ib9LM8wYk')
    // 進行加密
    const encrypted = cryptoJs.AES.encrypt(body, key, {
      iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7
    })
    // 將加密後的數據設置為 Data 字段
    config.data.Data = encrypted.toString()
    // console.log(config.data)
  }
  // 將修改後的數據轉換回 JSON 字符串
  config.data = JSON.stringify(config.data)
  return config
})
apiOpay.interceptors.response.use(response => {
  // 確保響應數據是一個對象
  if (typeof response.data === 'string') {
    try {
      response.data = JSON.parse(response.data)
    } catch (e) {
      // 如果解析失敗，保持原樣
    }
  }

  // 只解密 Data 部分
  if (response.data && response.data.Data) {
    // 定義密鑰和 IV
    const key = cryptoJs.enc.Utf8.parse('ejCk326UnaZWKisg')
    const iv = cryptoJs.enc.Utf8.parse('q9jcZX8Ib9LM8wYk')

    // 進行解密
    const decrypted = cryptoJs.AES.decrypt(response.data.Data, key, {
      iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7
    })

    // 將解密後的數據轉換為 UTF8 字符串

    const decryptedString = decrypted.toString(cryptoJs.enc.Utf8)

    response.data.Data = JSON.parse(decodeURIComponent(decryptedString))
  }

  return response
}, error => {
  // 處理響應錯誤
  return Promise.reject(error)
})

export { api, apiAuth, apiFuck, apiShit, apiOpay, apiOrder, giveMe, apiPay }
