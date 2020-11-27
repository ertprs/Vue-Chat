import store from "../store"

export function formataNome(nome){
  if(!nome){ return '' }
  nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, (capitalize) => { return capitalize.toUpperCase() })
  return nome
}

export function formataSigla(letra, acao){
  if(!letra || !acao){ return }
  if(acao == 'upper'){
    return letra.toUpperCase()
  }else if(acao == 'lower'){
    return letra.toLowerCase()
  }
}

export function formataDataHora(dataHora, origem){
  const dicionario = store.getters.getDicionario

  if(!dataHora){
    return ""
  }

  let arrDataHora = dataHora.split(" ")
  if(arrDataHora.length){
    let data = arrDataHora[0]
    let hora = arrDataHora[1]

    if(!data || !hora){
      return dataHora
    }

    data = data.split("-")
    data = data.reverse()
    data = data.join("/")

    if(!origem){
      hora = hora.slice(0, 5)
    }else{
      hora = hora.slice(0, 8)
    }

    if(!origem){
      return `${data} ${dicionario.msg_divisao_data_hora} ${hora}`
    }else{
      return `${data} ${hora}`
    }
  }else{
    return dataHora
  }
}

export function formataHoraAtual() {
  let data = new Date();
  let hora = data.getHours();
  hora = hora < 10 ? "0" + hora : hora;
  let minutos = data.getMinutes();
  minutos = minutos < 10 ? "0" + minutos : minutos;
  const horaFormatada = hora + "h" + minutos;
  return horaFormatada;
}

export function formataTelefone(telefone){
  if(!telefone){ return '' }
  telefone = "+"+telefone.slice(0,2)+" ("+telefone.slice(2,4)+") "+telefone.slice(4, 9)+"-"+telefone.slice(9, telefone.length)
  return telefone
}

export function formataHorario(horas){
  if(!horas){ return '' }
  let date = new Date(0);
  date.setMinutes(horas.i)
  date.setSeconds(horas.s)
  let timeString = date.toISOString().substr(11, 8);
  timeString = timeString.replace(/\d+:/, horas.h.toString().padStart(2, 0) + ':')
  return timeString
}

export function formataDataAgenda(data, hora, atd, retorno, id){

  if(!data || !hora){
    return
  }

  if(retorno){
    if(!id || !atd){
      return
    }
  }

  let dataAux = data
  let horaAux = hora

  if(!retorno){
    dataAux = dataAux.replace(/-/g, "\/")
    dataAux = dataAux.split(/\//)
    dataAux = dataAux.reverse()
    dataAux = dataAux.join("/")

    horaAux = horaAux.replace(/:/g, "h")
    horaAux = horaAux.slice(0, horaAux.length-3)

    if(typeof(atd) == "object"){
      atd.data_agenda_formatada = dataAux + ' ' + horaAux
    }

    return dataAux + ' ' + horaAux
  }else{

    const spanContador = document.querySelector(`${id} span.contador-data-retorno`)

    if(!spanContador){
      return
    }

    // Diferenca entre dias
    let dataAux2 = data + " " + hora
    let dataAtual = new Date()
    let dataAgenda = new Date(dataAux2)

    let difDatas = Date.UTC(dataAgenda.getYear(), dataAgenda.getMonth(), dataAgenda.getDate(),0,0,0) - Date.UTC(dataAtual.getYear(), dataAtual.getMonth(), dataAtual.getDate(),0,0,0)
    // Retorna o valor em horas
    difDatas = difDatas / 1000 / 60 / 60
    // Retorna o valor em dias
    difDatas = difDatas / 24

    // Mesmo dia
    if(difDatas == 0){
      // Diferenca entre horarios
      let difHoras = dataAgenda.getHours() - dataAtual.getHours()
      let difMinutos = dataAgenda.getMinutes() - dataAtual.getMinutes()

      // Significa que os horarios estao em horas diferentes (ex: 11:00:00 e 10:59:59)
      if(difHoras > 0 || difHoras < 0){
        // Significa que o horário já passou
        if(difHoras < 0){
          return
        }

        // Significa que os minutos do horario atual sao maiores do que os minutos do horario agendado
        if(difMinutos < 0){
          difMinutos = 60 - Math.abs(difMinutos)
          difHoras = difHoras - 1
        }

        spanContador.classList.remove("d-none")
        if(difMinutos > 0){
          return `${difHoras}h e ${difMinutos}min`
        }else{
          return `${difHoras}h`
        }
      }else{

        // Significa que o horario esta a minutos do retorno
        if(difHoras == 0){
          spanContador.classList.remove("d-none")
          return `${difMinutos}min`
        }

        // Significa que chegou a hora de chamar o ctt
        if(difHoras == 0 && difMinutos == 0){
          spanContador.classList.add("d-none")
          return
        }

        // Significa que o horario agendado ja passou
        if(difHoras <= 0 && difMinutos < 0){
          spanContador.classList.add("d-none")
          return
        }

        // Significa que o horario ainda nao chegou
        spanContador.classList.remove("d-none")
        return `${difMinutos}min`
      }
    }else{
      // Dias diferentes
      // Data atual maior que data agendada
      if(difDatas < 0){
        spanContador.classList.add("d-none")
        return
      }else{
      // Data agendado maior que data atual
        spanContador.classList.remove("d-none")

        if(difDatas == 1){
          return `${difDatas} dia`
        }else{
          return `${difDatas} dias`
        }
      }
    }
  }
}
