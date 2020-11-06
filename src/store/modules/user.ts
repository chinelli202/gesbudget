import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import {
  removeAllEngagementVariables, setPermissions
  , setRoles, getRoles, getPermissions, getFirstNameUtilisateur, getLastNameUtilisateur
  , getNameUtilisateur, getMatriculeUtilisateur, getDivisionUtilisateur, getFonctionUtilisateur
  , getSaisisseurUtilisateur, getValideurUtilisateur, getStatutUtilisateur
  , setFirstNameUtilisateur, setLastNameUtilisateur, setNameUtilisateur
  , setMatriculeUtilisateur, setDivisionUtilisateur, setFonctionUtilisateur, setSaisisseurUtilisateur
  , setValideurUtilisateur, setStatutUtilisateur, setEmailUtilisateur
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
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public firstName = getFirstNameUtilisateur()
  public lastName = getLastNameUtilisateur()
  public name = getNameUtilisateur()
  public matricule = getMatriculeUtilisateur()
  public division = getDivisionUtilisateur()
  public fonction = getFonctionUtilisateur()
  public saisisseur = getSaisisseurUtilisateur()
  public valideur = getValideurUtilisateur()
  public statutUtilisateur = getStatutUtilisateur()
  public roles: any[] = getRoles()
  public permissions: any[] = getPermissions()
  public email = ''
  public avatar = '/img/avatar-icon.png'

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
    setToken(this.token)
  }

  @Mutation
  private SET_FIRST_NAME(firstName: string) {
    this.firstName = firstName
    setFirstNameUtilisateur(this.firstName)
  }

  @Mutation
  private SET_LAST_NAME(lastName: string) {
    this.lastName = lastName
    setLastNameUtilisateur(this.lastName)
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
    setNameUtilisateur(this.name)
  }

  @Mutation
  private SET_MATRICULE(matricule: string) {
    this.matricule = matricule
    setMatriculeUtilisateur(this.matricule)
  }

  @Mutation
  private SET_DIVISION(division: string) {
    this.division = division
    setDivisionUtilisateur(this.division)
  }

  @Mutation
  private SET_FONCTION(fonction: string) {
    this.fonction = fonction
    setFonctionUtilisateur(this.fonction)
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
    setRoles(roles)
  }

  @Mutation
  private SET_PERMISSIONS(permissions: string[]) {
    this.permissions = permissions
    setPermissions(permissions)
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
    setEmailUtilisateur(this.email)
  }

  @Mutation
  private SET_SAISISSEUR(saisisseur: string) {
    this.saisisseur = saisisseur
    setSaisisseurUtilisateur(this.saisisseur)
  }

  @Mutation
  private SET_VALIDEUR(valideur: string) {
    this.valideur = valideur
    setValideurUtilisateur(this.valideur)
  }

  @Mutation
  private SET_STATUT_UTILISATEUR(statutUtilisateur: string) {
    this.statutUtilisateur = statutUtilisateur
    setStatutUtilisateur(this.statutUtilisateur)
  }

  // Edit Login function
  @Action
  public async Login(userInfo: { email: string, password: string}) {
    let { email, password } = userInfo
    email = email.trim()
    const { data } = await login({ email, password })
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
    const { data } = await getUserInfo({ token: this.token })
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const {
      firstName, lastName, name, email, matricule, division, fonction,
      saisisseur, valideur, statutUtilisateur, roles, permissions
    } = data
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_ROLES(roles)
    this.SET_PERMISSIONS(permissions)
    this.SET_NAME(name)
    this.SET_MATRICULE(matricule)
    this.SET_DIVISION(division)
    this.SET_EMAIL(email)
    this.SET_FIRST_NAME(firstName)
    this.SET_FONCTION(fonction)
    this.SET_LAST_NAME(lastName)
    this.SET_ROLES(roles)
    this.SET_SAISISSEUR(saisisseur)
    this.SET_VALIDEUR(valideur)
    this.SET_STATUT_UTILISATEUR(statutUtilisateur)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
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
    await logout({ token: this.token })
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
