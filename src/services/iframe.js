import store from "../store"

export function carregarIframe(atendimentos) {
  let todosIframes = []
  for (let ramal in atendimentos) {
    if (atendimentos[ramal].url !== '') {
      let regex = /\s|\]|\[/g
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

export function ClearIFrames(idsFrames){
  const container = document.querySelector('.container-iframes')
  if(container){
    if(container.childNodes){
      if(container.childNodes.length){
        container.childNodes.forEach(el => {
          if(el.id){
            if(!idsFrames.includes(el.id)){
              let iframe = document.querySelector(`#${el.id}`)
              if(iframe){
                console.log("iframes limpos: ", iframe)
                iframe.remove()
              }
            }
          }
        })
      }
    }
  }
}

export function limparIframeUsuarioRemovido(idIframe){
  const iframe = document.querySelector(`#${idIframe}`)
  if(iframe){
    iframe.remove()
  }
}
