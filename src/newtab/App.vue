<template>
  <div>
    <h1 class="large-co2-label">Current atmospheric CO2 level</h1>
    <h2 class="large-co2-value" v-if="currentCO2 >= 0">{{currentCO2}}</h2>
    <!-- <img class="logo" src="/public/img/logo-web-safe.svg?emitFile=false"> -->
  </div>
</template>

<script>
import store from '../store'
import axios from 'axios'

export default {
  data() {
    return {}
  },
  store,
  created() {
    axios.get(`https://co2.booligoosh.workers.dev`)
    .then(response => {
      console.log(`HTML`, response.data)
      store.dispatch(`setCurrentCO2`, Number(/<tr><td>.+?<\/td><td> ([0-9.]+?) ppm<\/td><\/tr>/.exec(response.data)[1] || -1))
    })
  },
  computed: {
    currentCO2() {
      return this.$store.getters.currentCO2
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 5em;
  background: hsl(204, 6%, 16%);
  color: white;
  min-height: 100vh;
}
</style>

<style lang="scss" scoped>
.large-co2-label {
  margin: 0;
}
.large-co2-value {
  font-size: 10em;
  margin: 0;
}
.large-co2-value:after {
  content: 'PPM';
  font-size: 0.3em;
  opacity: .5;
  font-weight: 500;
  margin-left: .5em;
}
.logo {
  width: 3rem;
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  opacity: .5;
}
.logo:hover {
  opacity: .75;
}
</style>
