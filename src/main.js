import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css'
import {QrcodeStream }from 'vue-qrcode-reader';
import VueAxios from 'vue-axios'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { Geoloc } from 'vuelayers'
import Printer from 'vue-template-printer'
import VueGooglePlaces from 'vue-google-places'
Vue.use(VueGooglePlaces)

Vue.use(Printer)

Vue.use(Geoloc)

Vue.use(VueLayers)
Vue.use(QrcodeStream)
Vue.use(VueAxios, axios)
Vue.use(VueCookies, { expire: '1d'})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  VueLayers,
  QrcodeStream,
  VueAxios,
  axios,
  VueCookies,
  Geoloc,
  render: h => h(App)
}).$mount('#app')
