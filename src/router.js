import Vue from 'vue'
import VueRouter from 'vue-router'
const Dashboard = () => import('./components/Dashboard')
const Attestation = () => import('./components/Attestation')
const Assertion = () => import('./components/Assertion')

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [
      { path: "/", component: Dashboard },
      { path: "/register", component: Attestation },
      { path: "/authenticate", component: Assertion },
      { path: '*', redirect: '/'}
    ]
})