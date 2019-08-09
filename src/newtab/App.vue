<template>
  <div>
    <h1 class="large-co2-label">Current atmospheric CO2 level</h1>
    <h2 class="large-co2-value" v-if="currentCO2 >= 0">{{currentCO2}}</h2>
    <!-- <img class="logo" src="/public/img/logo-web-safe.svg?emitFile=false"> -->
    <ApexChart class="monthly-chart" :width="innerWidth - 0*10*16" type="line" :options="apexChartOptions" :series="apexChartSeries"/>
  </div>
</template>

<script>
import store from '../store'
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'

export default {
  data() {
    return {}
  },
  store,
  components: {
    ApexChart: VueApexCharts
  },
  created() {
    axios.get(`https://carbon-tab-cloud-functions.netlify.com/.netlify/functions/getCO2`)
    .then(response => {
      console.log(response.data)
      store.dispatch(`setCO2Levels`, response.data)
    })
  },
  computed: {
    currentCO2() {
      return this.$store.getters.currentCO2
    },
    CO2Levels() {
      return this.$store.getters.CO2Levels
    },
    innerWidth() {
      return window.innerWidth
    },
    apexChartOptions() {
      return {
        chart: {
          id: 'co2-over-time',
          background: `#26292b`,
          sparkline: {
            enabled: true,
          },
          animations: {
            enabled: false,
          }
        },
        grid: { 
          padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
          },
        },
        xaxis: {
          categories: Object.keys(this.CO2Levels)/*.filter(key => /01$/.test(key))*/,
          labels: {
            show: false
          },
          axisTicks: {
            show: false,
          }
        },
        theme: {
          mode: `dark`
        }
      }
    },
    apexChartSeries() {
      return [{
        name: 'CO2 level (PPM)',
        data: Object.keys(this.CO2Levels)/*.filter(key => /01$/.test(key))*/.map(key => this.CO2Levels[key].trend)
      }]
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
.large-co2-label, .large-co2-value {
  z-index: 1;
  position: relative;
  width: max-content;
  cursor: default;
}
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
.monthly-chart {
  // margin-left: -24px;
  margin-top: 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
