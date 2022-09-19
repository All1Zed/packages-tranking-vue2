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
import VueHtmlToPaper from 'vue-html-to-paper';

Vue.use(Geoloc)
const printOptions = {
  //id: "print",
  name:'_blank',
  popTitle: '',
  title:'lumas',

  // extraHead: '<!DOCTYPE html>',
  extraHead: '<meta http-equiv="Content-Language"content="en"/>',
  specs: [
    'fullscreen=false',
    'titlebar=false',
    'scrollbars=false'
  ],
  styles:['printer/printer.css'],
  // beforeOpenCallback (vue) {
  //   // vue.loading = true
  //   // console.log('before opening printer')
  // },
  // openCallback (vue) {
  //   // vue.loading = false
  //   // console.log('printing')
  // },
  // closeCallback (vue) {
  //   // console.log('printing done')
  //   // vue.printDialog = false
  // }
}
Vue.use(VueHtmlToPaper, printOptions)

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
