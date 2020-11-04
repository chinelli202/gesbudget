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

Vue.filter('capitalizeFirstLetter', function (value: string) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('dateFormatShort', function (value: string) {
  if (!value) return ''
  value = value.toString()
  let current_datetime = new Date(value)
  let formatted_date = current_datetime.getDate()
    + "/" + (current_datetime.getMonth() + 1) 
    + "/" + current_datetime.getFullYear()
    + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes()
  console.log("format date", formatted_date);
  return formatted_date;
})

Vue.filter('dateFormatLong', function (value: string) {
  if (!value) return ''
  let current_datetime = new Date(value)
  const options = { weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  };
  value = value.toString()
  value = current_datetime.toLocaleDateString('fr-FR', options)
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('numFormat', function (value: string) {
  if (!value) return ''
  value = value.toString();
  return value.toLocaleString();
})

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
