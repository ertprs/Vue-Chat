<template>
  <div class="chat-opcoes">
      <div class="chat-opcoes-titulo">
        <p :title="chatTitulo"> {{ chatTitulo }} </p>
        <span> Nome do Cliente </span>
      </div>
      <div class="chat-opcoes-infos">
        <p> Clique para Visualizar as Informacoes do Cliente </p>
      </div>
    </div>
</template>

<script>
export default {
  data(){
    return{
      chatTitulo: 'WhatsApp - Sucursal(ATD) - Protocolo 20200268741'
    }
  },
  methods: {
  }
}
</script>