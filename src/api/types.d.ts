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
  eng_date: Date,
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

export interface IRecapData {
  sumrow: object
  //collection : IRecapData[]
  header:any
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

export interface IMaquetteData {
  label: string
  montant: number
  description: string
}
export interface IMonthRecapCollection {
  months : IMonthRecapData[]
}

export interface IMonthRecapData {
  mois: string
  engagements: number
  realisations: number
  execution: number
  tauxExecution: number
  collection: Object[]
}

export interface recapHeader{
  labelLabel: string,
  previsionLabel: string,
  realisationsLabel: string,
  realisationsMoisLabel: string,
  realisationsMoisPrecedents: string,
  engagementsLabel: string,
  executionLabel: string,
  soldeLabel: string,
  tauxExecution: string,
}