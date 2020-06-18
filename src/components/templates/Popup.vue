<template>
  <div id="popup">
    <h2>{{ titulo }}</h2>
    <ul>
      <li v-for="(opt, i) in opcoes" :key="i">
        {{ opt }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['titulo', 'opcoes'],
  data(){
    return{
      popupAtivo: true
    }
  },
  methods: {
    fecharPopup(){
      this.popupAtivo = !this.popupAtivo
    }
  }
}
</script>

<style>

</style>