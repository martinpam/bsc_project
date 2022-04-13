<template>
  <div class="door"
  :class= "[{rotate: rotate}]"
  :style="[
   {'width': w + 'px'}, 
   {'height': h + 'px'},
   {'grid-column-start': left}, 
   {'grid-column-end': left + w} ,
   {'grid-row-start': top} ,
   {'grid-row-end': top+ h} 
   ]"
  ></div>
</template>

<script>
export default {
    props: ['rotate', 'top', 'left'],
   setup(props) {
       console.log(props.rotate)
       let w,h;
       if (props.rotate) {
           console.log('yes rotate is true');
            w = 10; h = 60;
       }
       else {
           console.log('rotate is false');
            w = 60; h = 10;
       }
      
       console.log(w,h)
       return {w,h}
   }
}
</script>

<style>
.door {
    background-color: brown;

   

}
</style>