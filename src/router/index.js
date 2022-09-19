import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import Operator from '../views/admin/Operater.vue'
import Processing from '../views/admin/Processing.vue'
import Collection from '../views/admin/Collection.vue'
import Sorting from '../views/admin/Sorting.vue'
import Transit from '../views/admin/TransitView.vue'
import Topups from '../views/admin/TopupsView.vue'
import Downloads from '../views/admin/DownloadsView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/operator',
    name: 'operator',
    component: Operator
  },
  {
    path: '/processing',
    name: 'processing',
    component: Processing
  },
  {
    path: '/collection',
    name: 'collection',
    component: Collection
  },
  {
    path: '/sorting',
    name: 'sorting',
    component: Sorting
  },
  {
    path: '/transit',
    name: 'transit',
    component: Transit
  },
  {
    path: '/topups',
    name: 'topups',
    component: Topups
  },
  {
    path: '/downloads',
    name: 'downloads',
    component: Downloads
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router
