import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  uid: '',
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  viptime:'',
  status:'',
  remark:''
}

const mutations = {
  SET_UID: (state,uid) =>{
    state.uid = uid
  },
  SET_REMARK: (state,remark) =>{
    state.remark = remark
  },
  SET_STATUS: (state,status) =>{
    state.status = status
  },
  SET_VIPTIME: (state,viptime) => {
    state.viptime = viptime
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}
var temprole = ''
const actions = {
  // user login
  login({ commit }, userInfo) {

    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        temprole = data.role
        if(data.role==='admin'){
          var tok = 'admin-token'
        }else{
          var tok = 'editor-token'
        }
        setToken(tok)
        commit('SET_UID', data.id)
        commit('SET_TOKEN', tok)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        commit('SET_VIPTIME',data.vip_time)
        commit('SET_STATUS',data.status)
        commit('SET_REMARK',data.remark)
        resolve()
        console.log('登录成功！')
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // const { data } = response
        console.log('角色：')
        console.log(temprole)
        if(temprole ==='admin'){
          console.log('管理员')
          var roles = ['admin']
        } else{
          console.log('用户')
          var roles = ['user']
        }
        
        // if (!data) {
        //   reject('Verification failed, please Login again.')
        // }

        // const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        commit('SET_ROLES', roles)
        
        resolve(state)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
