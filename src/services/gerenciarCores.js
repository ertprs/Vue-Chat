import store from "../store"

export function gerenciarCores(app, quem) {
  const tituloContatos = document.querySelector(".titulo-contatos")
  const tituloOpcoes = document.querySelector(".chat-opcoes-titulo")
  const tituloInformacoes = document.querySelector("#informacoes-titulo")

  if(tituloOpcoes && tituloContatos && tituloInformacoes){
    switch (quem){
      case "contatos":
        if((tituloInformacoes.style.cssText || tituloOpcoes.style.cssText) && !tituloContatos.style.cssText ){
          app.$root.$emit("adicionar-cores")
        }
      break;
      case "chat":
        if( (tituloContatos.style.cssText || tituloInformacoes.style.cssText) && !tituloOpcoes.style.cssText){
          app.$root.$emit("adicionar-cores")
        }
      break;
      case "informacoes":
        if((tituloContatos.style.cssText || tituloOpcoes.style.cssText) && !tituloInformacoes.style.cssText){
          app.$root.$emit("adicionar-cores")
        }
      break;
    }
  }
}
