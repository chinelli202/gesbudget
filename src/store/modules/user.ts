import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  first_name: string
  last_name: string
  name: string
  matricule: string
  roles: string[]
  email: string
  division: string
  fonction: string
  saisisseur: string
  valideur: string
  statut_utilisateur: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public first_name = ''
  public last_name = ''
  public name = ''
  public matricule = ''
  public division = ''
  public fonction = ''
  public saisisseur = ''
  public valideur = ''
  public statut_utilisateur = ''
  public roles: string[] = []
  public email = ''


  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_FIRST_NAME(first_name: string) {
    this.first_name = first_name
  }

  @Mutation
  private SET_LAST_NAME(last_name: string) {
    this.last_name = last_name
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_MATRICULE(matricule: string) {
    this.matricule = matricule
  }

  @Mutation
  private SET_DIVISION(division: string) {
    this.division = division
  }

  @Mutation
  private SET_FONCTION(fonction: string) {
    this.fonction = fonction
  }


  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  // Edit Login function
  @Action
  public async Login(userInfo: { email: string, password: string}) {
    let { email, password } = userInfo
    email = email.trim()
    const { data } = await login({ email, password })
    setToken(data.token)
    this.SET_TOKEN(data.token)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo({ token : this.token })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const {first_name,last_name, name, email, matricule, division,fonction
    ,saisisseur, valideur, statut_utilisateur, roles} = data
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_ROLES(roles)
    this.SET_NAME(name)
    this.SET_MATRICULE(matricule)
    this.SET_DIVISION(division)
    this.SET_EMAIL(email)
    this.SET_FIRST_NAME(first_name)
    this.SET_FONCTION(fonction)
    this.SET_LAST_NAME(last_name)
    this.SET_ROLES(roles)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
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
    await logout()
    removeToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
