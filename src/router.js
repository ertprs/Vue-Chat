import Vue from "vue"
import Router from "vue-router"

import Chat from "./components/templates/Chat"

Vue.use(Router);

let baseURL = String

if(location.hostname == 'localhost'){
  baseURL = ''
}else{
  baseURL = 'kpi/'
}

export default new Router({
  base: '',
  mode: 'history',
  routes: [
    {
      path: "/",
      component: Chat
    }
  ]
});