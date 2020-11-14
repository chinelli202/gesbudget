import { RouteConfig } from 'vue-router'

const routesKey = 'routes'
export const getRoutes = () => JSON.parse(localStorage.getItem(routesKey) || '[]')
export const setRoutes = (routes: RouteConfig[]) => localStorage.setItem(routesKey, JSON.stringify(routes))
export const removeRoutes = () => localStorage.removeItem(routesKey)

const dynamicRoutesKey = 'dynamicRoutes'
export const getDynamicRoutes = () => JSON.parse(localStorage.getItem(dynamicRoutesKey) || '[]')
export const setDynamicRoutes = (dynamicRoutes: RouteConfig[]) => localStorage.setItem(dynamicRoutesKey, JSON.stringify(dynamicRoutes))
export const removeDynamicRoutes = () => localStorage.removeItem(dynamicRoutesKey)

const firstNameUtilisateurKey = 'firstNameUtilisateur'
export const getFirstNameUtilisateur = () => localStorage.getItem(firstNameUtilisateurKey) || ''
export const setFirstNameUtilisateur = (firstName: string) => localStorage.setItem(firstNameUtilisateurKey, firstName)
export const removeFirstNameUtilisateur = () => localStorage.removeItem(firstNameUtilisateurKey)

const lastNameUtilisateurKey = 'lastNameUtilisateur'
export const getLastNameUtilisateur = () => localStorage.getItem(lastNameUtilisateurKey) || ''
export const setLastNameUtilisateur = (lastName: string) => localStorage.setItem(lastNameUtilisateurKey, lastName)
export const removeLastNameUtilisateur = () => localStorage.removeItem(lastNameUtilisateurKey)

const nameUtilisateurKey = 'nameUtilisateur'
export const getNameUtilisateur = () => localStorage.getItem(nameUtilisateurKey) || ''
export const setNameUtilisateur = (name: string) => localStorage.setItem(nameUtilisateurKey, name)
export const removeNameUtilisateur = () => localStorage.removeItem(nameUtilisateurKey)

const matriculeUtilisateurKey = 'matriculeUtilisateur'
export const getMatriculeUtilisateur = () => localStorage.getItem(matriculeUtilisateurKey) || ''
export const setMatriculeUtilisateur = (matricule: string) => localStorage.setItem(matriculeUtilisateurKey, matricule)
export const removeMatriculeUtilisateur = () => localStorage.removeItem(matriculeUtilisateurKey)

const divisionUtilisateurKey = 'divisionUtilisateur'
export const getDivisionUtilisateur = () => localStorage.getItem(divisionUtilisateurKey) || ''
export const setDivisionUtilisateur = (division: string) => localStorage.setItem(divisionUtilisateurKey, division)
export const removeDivisionUtilisateur = () => localStorage.removeItem(divisionUtilisateurKey)

const fonctionUtilisateurKey = 'fonctionUtilisateur'
export const getFonctionUtilisateur = () => localStorage.getItem(fonctionUtilisateurKey) || ''
export const setFonctionUtilisateur = (fonction: string) => localStorage.setItem(fonctionUtilisateurKey, fonction)
export const removeFonctionUtilisateur = () => localStorage.removeItem(fonctionUtilisateurKey)

const saisisseurUtilisateurKey = 'saisisseurUtilisateur'
export const getSaisisseurUtilisateur = () => localStorage.getItem(saisisseurUtilisateurKey) || ''
export const setSaisisseurUtilisateur = (saisisseur: string) => localStorage.setItem(saisisseurUtilisateurKey, saisisseur)
export const removeSaisisseurUtilisateur = () => localStorage.removeItem(saisisseurUtilisateurKey)

const valideurUtilisateurKey = 'valideurUtilisateur'
export const getValideurUtilisateur = () => localStorage.getItem(valideurUtilisateurKey) || ''
export const setValideurUtilisateur = (valideur: string) => localStorage.setItem(valideurUtilisateurKey, valideur)
export const removeValideurUtilisateur = () => localStorage.removeItem(valideurUtilisateurKey)

const statutUtilisateurKey = 'statutUtilisateur'
export const getStatutUtilisateur = () => localStorage.getItem(statutUtilisateurKey) || ''
export const setStatutUtilisateur = (statut: string) => localStorage.setItem(statutUtilisateurKey, statut)
export const removeStatutUtilisateur = () => localStorage.removeItem(statutUtilisateurKey)

const emailUtilisateurKey = 'emailUtilisateur'
export const getEmailUtilisateur = () => localStorage.getItem(emailUtilisateurKey) || ''
export const setEmailUtilisateur = (email: string) => localStorage.setItem(emailUtilisateurKey, email)
export const removeEmailUtilisateur = () => localStorage.removeItem(emailUtilisateurKey)

const rolesKey = 'roles'
export const getRoles = () => JSON.parse(localStorage.getItem(rolesKey) || '[]')
export const setRoles = (roles: string[]) => localStorage.setItem(rolesKey, JSON.stringify(roles))
export const removeRoles = () => localStorage.removeItem(rolesKey)

const permissionsKey = 'permissions'
export const getPermissions = () => JSON.parse(localStorage.getItem(permissionsKey) || '[]')
export const setPermissions = (permissions: string[]) => localStorage.setItem(permissionsKey, JSON.stringify(permissions))
export const removePermissions = () => localStorage.removeItem(permissionsKey)

const tvaKey = 'tva'
export const getTva = () => localStorage.getItem(tvaKey) || '0'
export const setTva = (tva: string) => localStorage.setItem(tvaKey, tva)
export const removeTva = () => localStorage.removeItem(tvaKey)

const devisesKey = 'devises'
export const getDevises = () => JSON.parse(localStorage.getItem(devisesKey) || '[]')
export const setDevises = (devises: string[]) => localStorage.setItem(devisesKey, JSON.stringify(devises))
export const removeDevises = () => localStorage.removeItem(devisesKey)

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

export const removeAllEngagementVariables = () => {
  removeFirstNameUtilisateur()
  removeLastNameUtilisateur()
  removeNameUtilisateur()
  removeMatriculeUtilisateur()
  removeDivisionUtilisateur()
  removeFonctionUtilisateur()
  removeSaisisseurUtilisateur()
  removeValideurUtilisateur()
  removeStatutUtilisateur()
  removeEmailUtilisateur()
  removeRoles()
  removePermissions()
  removeTva()
  removeDevises()
  removeTypesEngagement()
  removeNaturesEngagement()
  removeEtatsEngagement()
  removeStatutsEngagement()
}
