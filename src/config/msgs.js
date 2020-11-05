import Vue from "vue";
import Toasted from "vue-toasted";

Vue.use(Toasted, {
  iconPack: "fontawesome",
  duration: 3000
});

// Mensagens Padr�es
Vue.toasted.register(
  "defaultSuccess",
  payload => (!payload.msg ? "Opera\u00e7\u00e3o realizada com sucesso!" : payload.msg),
  { type: "success", icon: "check" }
);

Vue.toasted.register(
  "sucessoTransferencia",
  payload => (!payload.msg ? "Transfer\u00eancia realizada" : payload.msg),
  { type: "success", icon: "random" }
)

Vue.toasted.register(
  "defaultError",
  payload => (!payload.msg ? "Oops.. Erro inesperado." : payload.msg),
  { type: "error", icon: "times" }
);

Vue.toasted.register(
  "limiteCaracter",
  payload => (!payload.msg ? " Limite de caracteres excedido" : payload.msg),
  { type: "error", icon: "times" }
);

Vue.toasted.register(
  "formatoInvalido",
  payload => (!payload.msg ? "Selecione um formato v\u00e1lido" : payload.msg),
  { type: "error", icon: "times" }
);

Vue.toasted.register(
  "emConstrucao",
  payload => (!payload.msg ? "Constru\u00e7\u00e3o em andamento" : payload.msg),
  { type: "info", icon: "info" }
);