import Vue from "vue";
import Vuex from "vuex";

// Modulos
import atendimentos from './modulos/atendimentos'
import controlesFront from './modulos/controlesFront'
import emojis from './modulos/emojis'
import iframeModulo from './modulos/iframeModulo'
import regras from './modulos/regras'
import mensagens from './modulos/mensagens'
import agenda from './modulos/agenda'
import url from './modulos/url'
import popup from './modulos/popup'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { atendimentos, controlesFront, emojis, iframeModulo, regras, mensagens, agenda, url, popup }
});