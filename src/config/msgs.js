import Vue from "vue";
import store from "@/store";
import Toasted from "vue-toasted";

const dicionario = store.getters.getDicionario

Vue.use(Toasted, {
  iconPack: "fontawesome",
  duration: 3000
});

// Mensagens Padr�es
Vue.toasted.register(
  "defaultSuccess",
  payload => (!payload.msg ? dicionario.msg_sucesso : payload.msg),
  { type: "success", icon: "check" }
);

Vue.toasted.register(
  "sucessoTransferencia",
  payload => (!payload.msg ? dicionario.msg_sucesso_transferencia : payload.msg),
  { type: "success", icon: "random" }
)

Vue.toasted.register(
  "defaultError",
  payload => (!payload.msg ? dicionario.msg_erro : payload.msg),
  { type: "error", icon: "times" }
);

Vue.toasted.register(
  "limiteCaracter",
  payload => (!payload.msg ? dicionario.msg_limite_caracter : payload.msg),
  { type: "error", icon: "times" }
);

Vue.toasted.register(
  "formatoInvalido",
  payload => (!payload.msg ? dicionario.msg_formato_invalido : payload.msg),
  { type: "error", icon: "times" }
);

Vue.toasted.register(
  "emConstrucao",
  payload => (!payload.msg ? dicionario.msg_em_construcao : payload.msg),
  { type: "info", icon: "info" }
);