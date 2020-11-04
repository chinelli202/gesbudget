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


export interface IEngagementData {
  id: number,
  created_at: string,
  updated_at: string,
  code: string,
  libelle: string,
  montant_ht: number,
  montant_ttc: number,
  devise: string,
  nature: string,
  type: string,
  etat: string,
  statut: string,
  nb_imputations: number, 
  cumul_imputations: number,
  nb_apurements: number,
  cumul_apurements: number,
  saisisseur: string,
  valideur_first: string, 
  valideur_second: string,
  valideur_final: string,
  source: string
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
