import Vue from 'vue'
import VueRouter from 'vue-router'
const Dashboard = () => import('./components/Dashboard')
const Attestation = () => import('./components/Attestation')
const Assertion = () => import('./components/Assertion')

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
      { path: "/", component: Dashboard },
      { path: "/attestation", component: Attestation },
      { path: "/assertion", component: Assertion },
      { path: '*', redirect: '/'}
    ]
})