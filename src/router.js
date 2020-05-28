import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from './components/Dashboard'
import Attestation from './components/Attestation'
import Assertion from './components/Assertion'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
      { path: "/", component: Dashboard },
      { path: "/attestation", component: Attestation },
      { path: "/assertion", component: Assertion },
      { path: '*', redirect: '/'}
    ]
})