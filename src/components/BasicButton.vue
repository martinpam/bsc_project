<template>
  <router-link
    v-if="!disabled"
    :disabled="disabled"
    class="container"
    :to="goTo"
  >
    <div class="inner-text">{{ name }}</div>
    <img
      class="finished"
      v-if="finished"
      src="../assets/icons/check-mark.png"
    />
  </router-link>
  <div v-else class="container disabled">
    <div class="inner-text">{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: ["name", "goTo", "disabled", "finished"],
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
  cursor: pointer;
}

.disabled {
  cursor: default;
  background: #626161c1;
}

.finished {
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 50px;
}
</style>
