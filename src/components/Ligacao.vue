<template>
  <div class="ligacao-container">
    <div class="botoes-ligacao-container">
      <div class="btn-ligacao-superior btn-ligacao" v-text="dicionario.btn_ligacao_pausar"></div>
      <div class="btn-ligacao-superior btn-ligacao" v-text="dicionario.btn_ligacao_desligar"></div>
    </div>
    <div class="btn-ligacao-encerrar">
      <div class="btn-ligacao-inferior btn-ligacao" v-text="dicionario.btn_ligacao_encerrar"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters({
      dicionario: "getDicionario"
    })
  }
}
</script>
