<template>
  <div class="story-board">
      
      <img class="karin" src="../assets/images/karin.png" alt="Karin">
      <img class="robot" src="../assets/images/robot-1.png" alt="Robot">
  </div>
</template>

<script>
export default {
    name: "StoryBoard",
}
</script>

<style scoped>
    .story-board {
        height: 80%;
        width: 87%;
        background: #778899;
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        margin-top: 60px;
        max-height: 700px;
        max-width: 1400px;
        border-radius: 12px;
        display:flexbox;
        
    }
    .robot {
        width: 35%;
        position: relative;
        
       
    }
    .karin {
        width: 40%;
        position: relative;
        margin-right: 20%;
        
    }
</style>