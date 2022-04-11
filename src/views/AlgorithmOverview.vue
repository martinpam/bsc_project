<template>
  <div>
    <h1>{{ mdl[0].name_de }}</h1>
    <h2>Story Algorithmen</h2>
    <div class="grid">
        <div class="left-side">
           <div class="algorithm-container">
          <h3>Algorithmus: {{ allSimulations[currentSimulation].algorithm }}</h3>
          <CodeBox class="code-box"
            :algorithm="
              mdl[0].algorithms[allSimulations[currentSimulation].algorithm - 1]
                .lines
            "
          />
        </div>
        <div class="shopping-list-container">
          <h3>
            Einkaufsliste:
          </h3>
          {{ allSimulations[currentSimulation].shoppingList }}
        </div>
        </div>
        <div class="right-side">
         <div class="supermarket-container">
          <h3>Supermarkt: {{ allSimulations[currentSimulation].supermarket }} </h3>
          <div class="supermarket"></div>
        </div>
        </div>
    </div>
   
    
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import getModule from "../composables/getModule";
import CodeBox from "../components/CodeBox.vue";
export default {
  props: ["moduleName"],
  name: "AlgorithmOverview",
  components: { CodeBox },
  setup(props) {
    const { mdl, error, load } = getModule(props.moduleName);
    load();
    const currentSimulation = ref(0);
    const allSimulations = ref([]);
    console.log(mdl.value[0]);
    for (let chapter in mdl.value[0].chapters) {
      allSimulations.value.push(...mdl.value[0].chapters[chapter].simulations);
    }
    return { mdl, currentSimulation, allSimulations };
  },
};
</script>

<style>
.grid {
    display: flex;
}
.left-side {
    width: 40%;
}
.right-side {
    width: 60%;
}
.supermarket-container {

    border-radius: 12px;
    margin-right: 25px;
    margin-left: 15px;
}
.supermarket {
    height: 600px;
    width: 100%;
    background-color:blanchedalmond;
    border-radius: 12px;
  
}
.supermarket:after {
    content: "";
    display: block;

}

.code-box {
    width: 95%;
}
</style>
