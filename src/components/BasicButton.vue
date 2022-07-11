<template>
      <router-link  class="container" :to=goTo> 
     
        <div class="inner-text">{{ name }}</div> 
       
      </router-link>
      
</template>

<script>
export default {
  props: ['name', 'goTo'],
  name: "BasicButton",
};
</script>

<style>
  .inner-text {
    text-decoration: none;
    color: white;
    font-size: 25px; 
    top: 40%;
    position: relative;
    
  }

  .container {
    width: 240px;
    height: 130px;
    background: #3f3f3f;
    box-shadow: 1px 2px 3px #3f3f3f;
    border-radius: 8px;
    position: relative;
    margin: 0 auto;
    text-decoration: none;
    cursor:pointer;
  }
</style>
