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
  clearIframes(todosIframes, atendimentos)
  function clearIframes(iFrames, atendimentos) {
    var ids = []
    for (let ramal in atendimentos) {
      if (atendimentos[ramal].url !== '') {
        let regex = /\s|\]|\[/g
        if (atendimentos[ramal].login_usu.match(regex)) {
          ids.push(atendimentos[ramal].login_usu.replace(regex, ''))
        } else {
          ids.push(atendimentos[ramal].login_usu)
        }
      }
    }
    const clearedIFrames = iFrames.filter((iFrame) => {
      if(ids.includes(iFrame.id)) return iFrame
    })

    store.commit('setIframesDisponiveis', clearedIFrames)
  }
}
