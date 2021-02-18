import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import {
  removeAllEngagementVariables, getLoggedUser, setLoggedUser
} from '@/utils/localdb'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  firstName: string
  lastName: string
  name: string
  matricule: string
  roles: string[]
  permissions: string[]
  email: string
  division: string
  fonction: string
  saisisseur: string
  valideur: string
  statutUtilisateur: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule {
  public token = getToken() || ''
  public loggedUser = getLoggedUser()
  public roles: any[] = []
  public teams: any[] = []
  public avatar = '/img/avatar-icon.png'

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
    setToken(this.token)
  }

  @Mutation
  private SET_USER(user: any) {
    this.loggedUser = user
    setLoggedUser(user)
  }

  @Mutation
  private SET_ROLES(roles: any) {
    this.roles = roles
  }

  @Mutation
  private SET_TEAMS(teams: any) {
    this.teams = teams
  }

  // Edit Login function
  @Action
  public async Login(userInfo: { matricule: string, password: string}) {
    let { matricule, password } = userInfo
    matricule = matricule.trim()
    const { data } = await login({ matricule, password })
    this.SET_TOKEN(data.token)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async GetUserInfo(team: any = null) {
    console.log('debut GetUserInfo')
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    let query = team ? { teamId : team.id } : ( this.loggedUser.team ? { teamId : this.loggedUser.team.id } : {})
    console.log('getUserInfo ', query)
    const { data } = await getUserInfo(query)
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    
    // roles must be a non-empty array
    if (!data.roles || data.roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    console.log('getUserInfo data ', data)
    this.SET_USER(data)
    this.SET_ROLES(data.roles)
  }


  @Action
  public async ChangeRoles(role: string) {
    console.log("ChangeRoles")
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles, this.teams)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout({})
    removeToken()
    resetRouter()
    removeAllEngagementVariables()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
