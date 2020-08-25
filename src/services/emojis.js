import store from "../store"


export function converterHexaParaEmojis(mainData) {
    var emojis = store.getters.getEmojis
    // Percorrendo todas mensagens para transformar em emojis

    for (let atd in mainData.atendimentos) {
        for (let i = 0; i < mainData.atendimentos[atd].arrMsg.length; i++) {
            let regex = ''
            for (let j = 0; j < emojis.length; j++) {
                regex = new RegExp(emojis[j].hexa, 'gi')
                mainData.atendimentos[atd].arrMsg[i].msg = mainData.atendimentos[atd].arrMsg[i].msg.replace(regex, emojis[j].emoji)
            }
        }
    }
    return mainData
}