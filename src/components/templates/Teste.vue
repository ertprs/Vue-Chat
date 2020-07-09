<template>
  <div>
    <label>
      Arquivo
      <input type="file" id="file" ref="file" accept="image/*" v-on:change="fileUpload()">
    </label>
    <img v-bind:src="imagePreview" v-show="showPreview"/>
    <button v-on:click="submitFile()">Enviar</button>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return{
      file: '',
      showPreview: false,
      imagePreview: ''
    }
  },
  methods: {
    fileUpload(){
      this.file = this.$refs.file.files[0]

      let reader = new FileReader()

      reader.addEventListener("load", function() {
        this.showPreview = true;
        this.imagePreview = reader.result;
      }.bind(this), false)

      if(this.file){
        if(/\.(jpe?g|png|gif)$/i.test( this.file.name )){
          reader.readAsDataURL(this.file)
        }
      }

    },
    submitFile(){
      // tratativa anterior
      let formData = new FormData()
      formData.append('file', this.file)

      console.log('formData: ', formData)
      console.log('file: ', this.file)
      // axios.post('',
      // formData,
      // {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then(response => {
      //   console.log('Sucesso!', response)
      // }).catch(error => {
      //   console.log('Erro!', error)
      // })
    }
  }
}
</script>

<style>

</style>