import Vue from "vue";
import "@babel/polyfill"
import { Datetime } from 'vue-datetime'
import VueTippy, { TippyComponent } from "vue-tippy";
import 'vue-datetime/dist/vue-datetime.css'
import "../public/assets/css/style.css";
import "./config/msgs";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faRandom, faUndo, faSignOutAlt, faAddressBook, faHourglassEnd, faFileAlt, faCheck, faCheckDouble, faTimes, faTimesCircle, faHourglass, faPause, faPlay, faComment, faComments, faCommentSlash, faArrowAltCircleDown, faImage, faPaperPlane, faPaperclip, faLevelUpAlt, faLongArrowAltLeft, faFolder, faUserPlus, faInfoCircle, faPhoneAlt, faUserClock, faClock, faFolderOpen, faArrowCircleDown, faDownload, faSearchPlus, faStopwatch, faInfo } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { dom } from '@fortawesome/fontawesome-svg-core'

import App from "./App.vue";
import router from "./router";
import Chat from './components/templates/Chat'
import store from "./store"
import { getAtendimentos } from "./services/atendimentos"

library.add(faRandom, faUndo, faSignOutAlt, faAddressBook, faHourglassEnd, faFileAlt, faCheck, faCheckDouble, faTimes, faTimesCircle, faHourglass, faPause, faPlay, faComment, faComments, faCommentSlash, faArrowAltCircleDown, faImage, faPaperPlane, faPaperclip, faLevelUpAlt, faLongArrowAltLeft, faFolder, faUserPlus, faInfoCircle, faPhoneAlt, faUserClock, faClock, faFolderOpen, faArrowCircleDown, faDownload, faSearchPlus, faStopwatch, faInfo)
dom.watch()

Vue.use(Datetime)
Vue.use(VueTippy)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component("tippy", TippyComponent)

Vue.config.productionTip = false;

var app = new Vue({
  router,
  store,
  Chat,
  render: h => h(App),
  created: () => {
    let baseUrl = ''
    if(window.location.hostname == 'localhost'){
      baseUrl = 'https://linux03'
    }else{
      baseUrl = 'https://'+window.location.hostname
    }

    store.dispatch('setURL', `${baseUrl}/im/atdHumano/middleware/atd_api.php/`)
  },
  mounted() {
    store.dispatch('setCaso', 206)
    getAtendimentos(this)
  }
}).$mount("#app");
