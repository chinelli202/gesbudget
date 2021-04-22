const loggedUserKey = 'loggedUser'
export const getLoggedUser = () => JSON.parse(localStorage.getItem(loggedUserKey) || '[]')
export const setLoggedUser = (user: any) => localStorage.setItem(loggedUserKey, JSON.stringify(user))
export const removeLoggedUser = () => localStorage.removeItem(loggedUserKey)

const tvaKey = 'tva'
export const getTva = () => localStorage.getItem(tvaKey) || '0'
export const setTva = (tva: string) => localStorage.setItem(tvaKey, tva)
export const removeTva = () => localStorage.removeItem(tvaKey)

const devisesKey = 'devises'
export const getDevises = () => JSON.parse(localStorage.getItem(devisesKey) || '[]')
export const setDevises = (devises: string[]) => localStorage.setItem(devisesKey, JSON.stringify(devises))
export const removeDevises = () => localStorage.removeItem(devisesKey)

const typesPaiementKey = 'typesPaiement'
export const getTypesPaiement = () => JSON.parse(localStorage.getItem(typesPaiementKey) || '[]')
export const setTypesPaiement = (typesPaiement: string[]) => localStorage.setItem(typesPaiementKey, JSON.stringify(typesPaiement))
export const removeTypesPaiement = () => localStorage.removeItem(typesPaiementKey)

const typesEngagementKey = 'typesEngagement'
export const getTypesEngagement = () => JSON.parse(localStorage.getItem(typesEngagementKey) || '[]')
export const setTypesEngagement = (typesEngagement: string[]) => localStorage.setItem(typesEngagementKey, JSON.stringify(typesEngagement))
export const removeTypesEngagement = () => localStorage.removeItem(typesEngagementKey)

const naturesEngagementKey = 'naturesEngagement'
export const getNaturesEngagement = () => JSON.parse(localStorage.getItem(naturesEngagementKey) || '[]')
export const setNaturesEngagement = (naturesEngagement: string[]) => localStorage.setItem(naturesEngagementKey, JSON.stringify(naturesEngagement))
export const removeNaturesEngagement = () => localStorage.removeItem(naturesEngagementKey)

const etatsEngagementKey = 'etatsEngagement'
export const getEtatsEngagement = () => JSON.parse(localStorage.getItem(etatsEngagementKey) || '[]')
export const setEtatsEngagement = (etatsEngagement: string[]) => localStorage.setItem(etatsEngagementKey, JSON.stringify(etatsEngagement))
export const removeEtatsEngagement = () => localStorage.removeItem(etatsEngagementKey)

const statutsEngagementKey = 'statutsEngagement'
export const getStatutsEngagement = () => JSON.parse(localStorage.getItem(statutsEngagementKey) || '[]')
export const setStatutsEngagement = (statutsEngagement: string[]) => localStorage.setItem(statutsEngagementKey, JSON.stringify(statutsEngagement))
export const removeStatutsEngagement = () => localStorage.removeItem(statutsEngagementKey)

const budgetStructureKey = 'budgetStructure'
export const getLocaldbBudgetStructure = () => JSON.parse(localStorage.getItem(budgetStructureKey) || '[]')
export const setLocaldbBudgetStructure = (budgetStructure: any) => localStorage.setItem(budgetStructureKey, JSON.stringify(budgetStructure))
export const removeLocaldbBudgetStructure = () => localStorage.removeItem(budgetStructureKey)

export const removeAllEngagementVariables = () => {
  removeTva()
  removeDevises()
  removeTypesEngagement()
  removeNaturesEngagement()
  removeEtatsEngagement()
  removeStatutsEngagement()
  removeLocaldbBudgetStructure()
  removeTypesPaiement()
  removeLoggedUser()
}
