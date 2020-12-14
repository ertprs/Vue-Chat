import store from "../store"

const regexIframe = store.getters.getRegexIframe

export function carregarIframe(atendimentos) {
  let todosIframes = []
  for (let ramal in atendimentos) {
    if (atendimentos[ramal].url !== '') {
      let id = ""

      if (atendimentos[ramal].login_usu.match(regexIframe)) {
        id = atendimentos[ramal].login_usu.replace(regexIframe, '')
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
  if (id.match(regexIframe)) {
    id = id.replace(regexIframe, '')
  }

  let objIframe = { id: id, url: url }
  store.commit('pushIframesDisponiveis', objIframe)
}

export function limparIframeUsuarioRemovido(idIframe){
  const iframe = document.querySelector(`#${idIframe}`)

  const id = idIframe.replace("iframe_", "")
  const todosIframes = store.getters.getIframesDisponiveis

  const array = todosIframes.filter(iframe => {
    return iframe.id != id
  })

  store.commit("setIframesDisponiveis", array)

  if(iframe){
    iframe.remove()
  }
}
