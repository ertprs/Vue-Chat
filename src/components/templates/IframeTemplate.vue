<template>
  <div class="container-iframes">
    <div
      class="iframes_disponiveis"
      v-for="(frame, indice) in iframesDisponiveis"
      :id="'iframe_' + frame.id"
      :key="indice"
    >
      <iframe :src="frame.url" frameborder="0" @load="gif = false" @loadstart="gif = true"></iframe>
    </div>
    <div class="load" v-if="gif">
      <i class="fas fa-hourglass-end"></i>
      <p> {{ dicionario.titulo_carregando }} </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data(){
    return{
      gif: true
    }
  },
  mounted() {
    this.$root.$on('mostrar-iframe', (idCliente, urlFrame) => {
      this.mostraIframe(idCliente, urlFrame)
    })
    for(let i in this.iframesDisponiveis) {
      if(this.iframesDisponiveis[i].id === this.atendimentoAtivo.id) {
        this.mostraIframe(this.iframesDisponiveis[i].id, this.iframesDisponiveis[i].url)
      }
    }
  },
  methods: {
    mostraIframe(idCliente, urlFrame) {
      if(urlFrame != '') {
        let objIframe = {id: idCliente, url: urlFrame}
        if(this.iframesDisponiveis.length > 0) {
          const idsIframe = this.iframesDisponiveis.map(iframe => (iframe.id))
          if(!idsIframe.includes(idCliente)) {
            this.$store.dispatch('setIframesDisponiveis', objIframe)
          }
        } else {
          this.$store.dispatch('setIframesDisponiveis', objIframe)
        }
        this.$nextTick(() => {
          if(document.querySelector('.iframes_disponiveis')) {
            let elementos = document.querySelectorAll('.iframes_disponiveis')
            if(!elementos || !elementos[0]){
              return false
            }
            for(let i = 0; i < elementos.length; i++) {
              let listaElem = elementos[i]
              if(listaElem){
                listaElem.classList.add('d-none')
              }
            }
          }

          let regex =  /\s|\]|\[/g
          
          if(idCliente.match(regex)){
              idCliente = idCliente.replace(regex, '')
          }else{
              idCliente = idCliente
          }

          const iframeCliente = document.querySelector("#iframe_" + idCliente)
          if(iframeCliente){
            iframeCliente.classList.remove('d-none')
          }
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      iframesDisponiveis: "getIframesDisponiveis",
      atendimentoAtivo: "getAtendimentoAtivo",
      dicionario: "getDicionario"
    }),
  },
  beforeDestroy() {
    this.$root.$off('mostrar-iframe')
  }
};
</script>

<style>
</style>