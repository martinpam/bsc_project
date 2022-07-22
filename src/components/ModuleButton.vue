<template>
  <router-link class="container" :to="goTo">
    <slot class="img"></slot>
    <div class="inner-text">{{ name }}</div>
    <div class="sub-text">{{ subText }}</div>
  </router-link>
</template>

<script>
export default {
  props: ["name", "goTo", "subText"],
  name: "Button",
};
</script>

<style scoped>
.inner-text,
.sub-text {
  text-decoration: none;
  color: white;
  font-size: 35px;

  position: relative;
}
.inner-text {
  top: 5%;
}
.sub-text {
  font-size: 15px;
  top: 16%;
  margin: 0 15px;
  color: lightgray;
}

.container {
  width: 320px;
  height: 230px;
  background: #3f3f3f;
  box-shadow: 1px 2px 3px #3f3f3f;
  border-radius: 8px;
  position: relative;
  margin: 0 auto;
  text-decoration: none;
  cursor: pointer;
}

</style>
