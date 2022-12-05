<template>
    <div class="contentBox">
      <p :style="{color:'#000000'}" style="font-size: 20px;margin-top: -30px;">{{itemData.value}}</p>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'Carddraggerdata-tw',
    props:{
      itemData:{
        type:Object
      }
    },
    mounted() {
      console.log(this.itemData)
    },
  }
  
  </script>
  <style scoped>
  .contentBox{
    width: 100%;
    height:100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  