<template>
  <div class="container-iframes" style="height: 100%">
    <div
      class="iframes_disponiveis"
      v-for="(frame, indice) in iframesDisponiveis"
      :id="'iframe_' + frame.id"
      :key="indice"
    >
      <iframe :src="frame.url" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  mounted() {
    this.$root.$on('mostrarIframe', (idCliente, urlFrame) => {
      this.mostraIframe(idCliente, urlFrame)
    })
  },
  watch: {
  },
  methods: {
    mostraIframe: function(idCliente, urlFrame) {
      if(urlFrame != '') {
        var objIframe = {id: idCliente, url: urlFrame}
        if(this.iframesDisponiveis.length > 0) {
          const idsIframe = this.iframesDisponiveis.map(iframe => (iframe.id))
          if(!idsIframe.includes(idCliente)) {
            this.$store.dispatch('setIframesDisponiveis', objIframe)
          } else {
            // console.log(this.iframesDisponiveis)
          }
        } else {
          this.$store.dispatch('setIframesDisponiveis', objIframe)
        }
        this.$nextTick(function () {
          if(document.querySelector('.iframes_disponiveis')) {
            var elementos = document.querySelectorAll('.iframes_disponiveis')
            if(!elementos || !elementos[0]){
              return false
            }
            for(let i = 0; i < elementos.length; i++) {
              elementos[i].classList.add('d-none')
            }
          }
          document.querySelector("#iframe_" + idCliente).classList.remove('d-none')
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      iframesDisponiveis: "getIframesDisponiveis",
    }),
  },
};
</script>

<style>
</style>