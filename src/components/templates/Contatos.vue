<template>
  <div id="todos-contatos" > <!--  v-if="clienteMandouMensagem" -->
    <div class="titulo-contatos">
      <h1> Contatos </h1>
    </div>
      {{ objetoContato }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      clienteMandouMensagem: 'getClienteMandouMensagem',
      objetoContato: 'getTodasMensagens'
    })
  }
}
</script>

<style>

</style>