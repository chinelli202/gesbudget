export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface IBudgetFonctionnement {
  id: number
  previsions: number
  realisationsMois: number
  realisationsPrecedentes: number
  realisationsCumulees: number
  engagements: number
  execution: number
  solde: number
  tauxExecution: number
}

export interface IGroupeFonctionnement {
  libelle: string
  id: number
  previsions: number
  realisationsMois: number
  realisationsPrecedentes: number
  realisationsCumulees: number
  engagements: number
  execution: number
  solde: number
  tauxExecution: number
}

export interface ISousSectionFonctionnement {
  sumrow: object
  collection: Array<object>
}
