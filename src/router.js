import Vue from 'vue'
import VueRouter from 'vue-router'
import Attestation from './components/Attestation'
import Assertion from './components/Assertion'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
      { path: "/attestation", component: Attestation },
      { path: "/assertion", component: Assertion },
      { path: '*', redirect: '/attestation'}
    ]
})