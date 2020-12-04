import store from "../store"

export function carregarIframe(atendimentos) {
  let todosIframes = []
  for (let ramal in atendimentos) {
    if (atendimentos[ramal].url !== '') {
      let regex = /\s|\]|\[|\!|\@|\$|\%|\&|\*|\(|\)|\-|\_|\=|\+/g
      let id = ""

      if (atendimentos[ramal].login_usu.match(regex)) {
        id = atendimentos[ramal].login_usu.replace(regex, '')
      } else {
        id = atendimentos[ramal].login_usu
      }

      var objIframe = { id: id, url: atendimentos[ramal].url }
      todosIframes.push(objIframe)
    }
  }

  store.commit('setIframesDisponiveis', todosIframes)
}

export function adicionarIframeNovoUsu(id, url){
  const regex = /\s|\]|\[|\!|\@|\$|\%|\&|\*|\(|\)|\-|\_|\=|\+/g
  if (id.match(regex)) {
    id = id.replace(regex, '')
  }

  let objIframe = { id: id, url: url }
  store.commit('pushIframesDisponiveis', objIframe)
}

export function limparIframeUsuarioRemovido(idIframe){
  const iframe = document.querySelector(`#${idIframe}`)
  if(iframe){
    iframe.remove()
  }
}
