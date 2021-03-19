import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

Vue.use(Router)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home'
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/dashboard/',
    name: 'engagementHome',
    meta: {
      title: 'engagementHome',
      icon: 'component',
      teams: ['snh','snh_siege','cpsp']
    },
    children : [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "home" */ '@/views/engagement/home.vue'),
        //redirect: '/consulter/list/',
        name: 'engagementHomeDashboard',
        meta: {
          title: 'engagementHomeDashboard',
          icon: 'component',
          teams: ['snh','snh_siege','cpsp']
        }
      }
    ]
  },
  {
    path: '/engagement',
    component: Layout,
    redirect: '/engagement/list',
    name: 'engagement',
    meta: {
      title: 'engagement',
      icon: 'list',
      teams: ['snh','snh_siege','cpsp']
    },
    children : [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "engagementlist" */ '@/views/engagement/index.vue'),
        name: 'EngagementList',
        meta: {
          title: 'engagementList',
          activeMenu: '/engagement/list',
          icon: 'search',
          teams: ['snh','snh_siege','cpsp']
        }
      }
    ]
  },
  {
    path: '/detail',
    component: Layout,
    redirect: '/detail/engagement',
    name: 'engagementDetail',
    meta: {
      title: 'engagementDetail',
      icon: 'form',
      teams: ['snh','snh_siege','cpsp'],
      hidden: true
    },
    children : [
      {
        path: 'engagement/:id(\\d+)',
        component: () => import(/* webpackChunkName: "engagement-detail" */ '@/views/engagement/detail.vue'),
        name: 'engagementDetailView',
        meta: {
          title: 'engagementDetailView',
          teams: ['snh','snh_siege','cpsp'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/corbeille',
    component: Layout,
    redirect: '/corbeille/list',
    name: 'corbeille',
    meta: {
      title: 'corbeille',
      icon: 'list'
    },
    children : [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "corbeille" */ '@/views/engagement/pages/corbeille.vue'),
        name: 'corbeilleList',
        meta: {
          title: 'corbeilleList',
          icon: 'bug'
        }
      }
    ]
  },
  
  
  // {
  //   path: '/elaboration',
  //   component: Layout,
  //   name: 'elaboration',
  //   meta: {
  //     title: 'elaboration',
  //     icon: 'edit',
  //   }, 
  //   children : [
  //     {
  //       path : 'draft',
  //       component: () => import('@/views/table/elaboration/draft.vue'),
  //       name: 'draftBudget',
  //       meta: {
  //         title: 'draftBudget',
  //         icon: 'data'
  //       }
  //     },
  //     {
  //       path : 'active',
  //       component: () => import('@/views/table/elaboration/maquette-active.vue'),
  //       name: 'maquetteActiveBudget',
  //       meta: {
  //         title: 'maquetteActiveBudget',
  //         icon: 'setting'
  //       }
  //     }
  //   ]
  // },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/etats',
    component: Layout,
    redirect: '/etats/fonctionnement',
    meta: {
      title: 'etatsBudget',
      icon: 'dashboard',
      teams: ['snh','SNHSIEGE']
    },
    children: [
      {
        path: 'fonctionnement',
        component: () => import(/* webpackChunkName: "etatslayout-fonctionnement" */ '@/sublayouts/etatslayout/index.vue'),
        name: 'Fonctionnement',
        children: [
          {
            path: 'generaux',
            component: () => import('@/views/table/etats-generaux.vue'),
            name: 'fonctionnement-generaux',
            meta: {
              title: 'fonctionnement',
            }
          },
          {
            path: ':entitytype/:entitykey',
            component: () => import('@/views/table/groupe-rubrique/index.vue'),
            name: 'element-fonctionnement',
            meta: {
              title: 'elementFonctionnement',
              hidden: true
            }
          },
          {
            path: 'navetats',
            component: () => import('@/components/NavigateurEtats/index.vue'),
            name: 'Navigateur Etats',
            meta: {
              title: 'navetats',
              hidden: true
            }
          }
        ],
        meta: {
          title: 'etatsFonctionnement',
          icon: 'tab',
          teams: ['snh','SNHSIEGE']
        }
      },
      {
        path: 'mandat',
        component: () => import(/* webpackChunkName: "etatslayout-mandat" */ '@/sublayouts/etatslayout/index.vue'),
        name: 'Mandat',
        children: [
          {
            path: 'generaux',
            component: () => import('@/views/table/etats-generaux.vue'),
            name: 'mandat-generaux',
            meta: {
              title: 'mandat',
            }
          },
          {
            path: ':entitytype/:entitykey',
            component: () => import('@/views/table/groupe-rubrique/index.vue'),
            name: 'element-mandat',
            meta: {
              title: 'elementMandat',
              hidden: true
            }
          }
        ],
        meta: {
          title: 'etatsMandat',
          icon: 'tab',
          teams: ['snh','SNHSIEGE']
        }
      }
    ]
  },
  {
    path: '/rapports',
    component: Layout,
    redirect: '/rapports/entreprise',
    name: 'rapports',
    meta: {
      title: 'rapports',
      icon: 'dashboard',
      teams: ['CPSP', 'asch', 'snh_douala']
    },
    children : [
      {
        path: 'entreprise',
        component: () => import('@/views/table/etats-entreprise.vue'),
        name: 'rapports-generaux',
        meta: {
          title: 'rapports',
          icon: 'dashboard',
          teams: ['CPSP', 'asch','snh_douala']
        }
      },
      {
        path: ':entitytype/:entitykey',
        component: () => import('@/views/table/groupe-rubrique/etat.vue'),
        name: 'etats-entreprise',
        meta: {
          title: 'etatsEntreprise',
          name:'etats-entreprise',
          icon: 'dashboard',
          teams: ['CPSP','asch','snh_douala'],
          hidden:true        
        }
      }
    ]
  }, 
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
