<template>
  <div class="chat-opcoes">
      <div class="chat-opcoes-titulo">
        <p :title="chatTitulo"> {{ chatTitulo }} </p>
      </div>
    </div>
</template>

<script>

export default {
  data(){
    return{
      chatTitulo: 'WhatsApp - Sucursal(ATD) - Protocolo 20200268741'
    }
  }
}
</script>