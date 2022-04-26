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
      {{ line["text"] }}
    </div>
  </div>
</template>

<script>

export default {
    props: ["algorithm"],
    name: 'CodeBox',
    setup() {
  
    }
};
</script>

<style>
.code-box {
  width: 100%;
  background-color: #0e0e0e;
  margin-bottom: 45px;
  margin-left: 25px;
  border-radius: 12px;
  overflow: scroll;
  margin-right: 12px;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.code-box::-webkit-scrollbar {
  display: none;
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
    padding-left: 12px;
    padding-top: 5px;
    font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
}

.highlight {
  color: 	orange;
}

.indent {
    min-width: 1.3rem;
}
</style>
