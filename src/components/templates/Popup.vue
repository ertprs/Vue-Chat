<template>
  <div id="popup">
    <h2>{{ titulo }}</h2>
    <ul>
      <li>Todos</li>
      <li>Pessoal</li>
      <li>Pessoal/Data</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['titulo'],
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