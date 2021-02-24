import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'

Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

Vue.filter('capitalizeFirstLetter', function(value: string) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('dateFormatShort', function(value: string) {
  if (!value) return ''
  value = value.toString()
  const currentDatetime = new Date(value)
  const formattedDate = currentDatetime.getDate() +
    '/' + (currentDatetime.getMonth() + 1) +
    '/' + currentDatetime.getFullYear() +
    ' ' + currentDatetime.getHours() + ':' + currentDatetime.getMinutes()
  return formattedDate
})

Vue.filter('dateFormatLong', function(value: string) {
  if (!value) return ''
  const currentDatetime = new Date(value)
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  value = value.toString()
  value = currentDatetime.toLocaleDateString('fr-FR', options)
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('numFormat', function(value: string) {
  if (!value) return '-'
  return value.toLocaleString()
})

/** Return the type of a timeline Item based on the type of action of the item 
 * Can return 
 * info / when action is related to engagement 'VALIDP', 'VALIDS', 'VALIDF', 'CANCEL_VALIDP', 'CANCEL_VALIDS', 'CANCEL_VALIDF', 'UPDATE', 'RESTORE', 'RESEND'
 *        'ADD_COMMENT', 'PREENGAGER'
 * primary / when action is related to imputation 'IMP_VALIDP', 'IMP_VALIDS', 'IMP_VALIDF', 'IMP_UPDATE', 'IMPUTER', 'IMP_RESTORE', 'IMP_RESEND', 'IMP_ADD_COMMENT'
 * success / 'APUR_VALIDP', 'APUR_VALIDS', 'APUR_VALIDF', 'APURER', 'APUR_UPDATE' , 'APUR_RESTORE', 'APUR_RESEND', 'APUR_ADD_COMMENT'
 * warning / when action is a cancellation ie in 'CANCEL_VALIDP', 'CANCEL_VALIDS', 'CANCEL_VALIDF', , 'IMP_CANCEL_VALIDP', 'IMP_CANCEL_VALIDS', 'IMP_CANCEL_VALIDF'
 *          'APUR_CANCEL_VALIDP', 'SEND_BACK', 'IMP_SEND_BACK', 'APUR_CANCEL_VALIDP', 'APUR_CANCEL_VALIDS', 'APUR_CANCEL_VALIDF', 'APUR_SEND_BACK', 
 * danger / when it's a close action 'IMP_CLOSE', 'CLOSE', 'APUR_CLOSE'
 * */
Vue.filter('tlItemType', function(item: any) {
  if(item.description.includes('CANCEL') || item.description.includes('SEND_BACK')){
    return 'warning'
  }

  if(item.description.includes('CLOSE')){
    return 'danger'
  }

  if(item.description.includes('IMP')){
    return 'primary'
  }

  if(item.description.includes('APUR')){
    return 'success'
  }
  return 'info'
})

/** Return icon of timeline item depending on action
 * el-icon-edit / created, UPDATE, RESEND
 * el-icon-circle-close / actions related to CLOSE
 * el-icon-check / VALIDP
 * el-icon-circle-check / VALIDS
 * el-icon-success / VALIDF
 * el-icon-chat-line-square / COMMENT
 * el-icon-refresh-left / SEND_BACK
 */
Vue.filter('tlItemIcon', function(item: any) {
  if(item.description.includes('created') || item.description.includes('UPDATE') || item.description.includes('RESEND')){
    return 'el-icon-edit'
  }

  if(item.description.includes('CLOSE')){
    return 'el-icon-circle-close'
  }

  if(item.description.includes('VALIDP')){
    return 'el-icon-check'
  }

  if(item.description.includes('VALIDS')){
    return 'el-icon-circle-check'
  }

  if(item.description.includes('VALIDF')){
    return 'el-icon-success'
  }

  if(item.description.includes('COMMENT')){
    return 'el-icon-chat-line-square'
  }

  if(item.description.includes('SEND_BACK')){
    return 'el-icon-refresh-left'
  }

  return 'el-icon-minus'
})

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
