<template>
  <div class="code-box">
    <div
      v-for="(line, index) in algorithm"
      :key="line"
      class="code-line"
      :class="{highlight: line['highlight']}"
    >
      <div class="line-number">{{ index + 1 }}</div>
      <div v-for="i in line['indent']" :key="i" class="indent"></div>
      {{ line[store.language] }}
    </div>
  </div>
</template>

<script>
import { store } from '../store.js';
export default {
    props: ["algorithm"],
    name: 'CodeBox',
   data() {
    return {
      store
    }
  }
};
</script>

<style>

.filler {
  
}

.line-number {
    text-align: right;
    margin-right: 1rem;
    min-width: 2rem;
}

.code-line {
    display: flex;
    color: #f0f0f0;
    font-size: 1.2rem;
    text-align: left;
    padding-left: 0.1rem;
    padding-top: 5px;
    font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
}

@media (max-width: 1200px) {
  .code-line {
    font-size: 0.8rem;  
  }   
};


.highlight {
  color: 	orange;
}

.indent {
    min-width: 1.3rem;
}
</style>
