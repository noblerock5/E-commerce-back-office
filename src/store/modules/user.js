// 引入登录|退出登录|获取用户信息接口
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
//路由模块当中重置路由的方法
import { resetRouter, anyRoutes, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

// 箭头函数
const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户图像
    avatar: '',
    //服务器返回的菜单信息[根据角色不同，返回的标记信息，数组里面的元素是字符串]
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限信息
    buttons: [],
    //对比之后[项目中已有的异步路由与服务器返回标记进行对比最终序言展示的数据]
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes:[],
  }
}

const state = getDefaultState()

// 唯一修改state的地方
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO:(state, userInfo) => {
    // 存储用户名
    state.name = userInfo.name
    // 存储头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    //按钮权限的标记
    state.buttons = userInfo.buttons
    // 角色信息
    state.roles = userInfo.roles
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex保存当前用户的异步路由：注意：用户需要展示完整的路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户要展示所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    // 给路由添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
  // // 存储用户名
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // // 存储用户头像
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}

//定义一个函数：两个进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户[超级管理|普通员工]需要展示异步路由
  return asyncRoutes.filter(item => {
    // 数组当中没有这个元素 返回索引值-1，如果有这个元素 返回索引值一定不是-1
    if(routes.indexOf(item.name) != -1) {
      // 递归:别忘记还有2、3、4级路由
      if(item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  //处理登录业务
  async login({ commit }, userInfo) {
    //解构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    //注意当前的登录的请求现在使用的mock，mock数据的code是20000
    if(result.code == 20000) {
      // vuex存储token
      commit('SET_TOKEN',result.data.token)
      // 本地持久化token
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息:返回的数据包括：用户名name。用户头像avatar，routes[返回的标志：不同的用户应该展示哪些菜单的标记]，roles：用户角色信息，buttons[按钮权限的信息：按钮权限的标记]
        const { data } = response
        //vuex存储全部的用户信息
        commit('SET_USERINFO',data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

