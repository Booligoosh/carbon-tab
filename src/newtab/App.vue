<template>
  <div>
    <h1 class="large-co2-label z-index-1">Current atmospheric CO2 level</h1>
    <h2 class="large-co2-value z-index-1" v-if="currentCO2 >= 0">{{currentCO2}}</h2>
    <div class="increases z-index-1">
      <div class="increase">{{increaseSinceLastYear > 0 ? 'Increased' : 'Decreased'}} by <div class="increase-number">{{Math.abs(increaseSinceLastYear)}} PPM</div> since last year</div>
      <div class="increase">{{increaseSinceLastMonth > 0 ? 'Increased' : 'Decreased'}} by <div class="increase-number">{{Math.abs(increaseSinceLastMonth)}} PPM</div> since last month</div>
      <div class="increase">{{increaseSinceLastWeek > 0 ? 'Increased' : 'Decreased'}} by <div class="increase-number">{{Math.abs(increaseSinceLastWeek)}} PPM</div> since last week</div>
      <div class="increase">{{increaseSinceYesterday > 0 ? 'Increased' : 'Decreased'}} by <div class="increase-number">{{Math.abs(increaseSinceYesterday)}} PPM</div> since yesterday</div>
    </div>
    <!-- <img class="logo" src="/public/img/logo-web-safe.svg?emitFile=false"> -->
    <ApexChart class="monthly-chart" :width="innerWidth" :height="innerHeight" type="line" :options="apexChartOptions" :series="apexChartSeries"/>
  </div>
</template>

<script>
import store from '../store'
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'

const increaseDecimalPlaces = 2

export default {
  data() {
    return {
      innerWidth: 0,
      innerHeight: 0
    }
  },
  store,
  components: {
    ApexChart: VueApexCharts
  },
  created() {
    // Only check for updates every hour (to reduce cloud function strain)
    if (Date.now() - this.$store.getters.lastUpdateEpoch > 3600000) { // 1000*60*60 aka 1 hour
      this.updateCO2()
    }
    // Set initial size
    this.updateSize()
    // Update size everytime the window is resized
    window.addEventListener('resize', this.updateSize)
  },
  methods: {
    updateCO2() {
      axios.get(`https://carbon-tab-cloud-functions.netlify.com/.netlify/functions/getCO2`)
      .then(response => {
        console.log(response.data)
        store.dispatch(`setCO2Levels`, response.data)
        store.dispatch(`setLastUpdateEpoch`, Date.now())
      })
    },
    padWithZeroes (number, desiredLength) {
      number = number.toString()
      while (number.length < desiredLength) {
        number = `0` + number
      }
      return number
    },
    updateSize() {
      this.innerWidth = window.innerWidth
      this.innerHeight = window.innerHeight
    }
  },
  computed: {
    currentCO2() {
      return this.$store.getters.currentCO2
    },
    CO2Levels() {
      return this.$store.getters.CO2Levels
    },
    yesterdayDate() {
      return Object.keys(this.CO2Levels).reverse()[1]
    },
    lastWeekDate() {
      let date = new Date()
      date.setDate(date.getDate() - 7)
      return `${date.getFullYear()}-${this.padWithZeroes(date.getMonth() + 1, 2)}-${this.padWithZeroes(date.getDate(), 2)}`
    },
    lastMonthDate() {
      let date = new Date()
      date.setMonth(date.getMonth() - 1)
      return `${date.getFullYear()}-${this.padWithZeroes(date.getMonth() + 1, 2)}-${this.padWithZeroes(date.getDate(), 2)}`
    },
    lastYearDate() {
      let date = new Date()
      date.setFullYear(date.getFullYear() - 1)
      return `${date.getFullYear()}-${this.padWithZeroes(date.getMonth() + 1, 2)}-${this.padWithZeroes(date.getDate(), 2)}`
    },
    increaseSinceLastYear() {
      return (this.currentCO2 - this.CO2Levels[this.lastYearDate].cycle).toFixed(increaseDecimalPlaces)
    },
    increaseSinceLastMonth() {
      return (this.currentCO2 - this.CO2Levels[this.lastMonthDate].cycle).toFixed(increaseDecimalPlaces)
    },
    increaseSinceLastWeek() {
      return (this.currentCO2 - this.CO2Levels[this.lastWeekDate].cycle).toFixed(increaseDecimalPlaces)
    },
    increaseSinceYesterday() {
      return (this.currentCO2 - this.CO2Levels[this.yesterdayDate].cycle).toFixed(increaseDecimalPlaces)
    },
    minPointY () {
      let min = Infinity
      for (let key in this.CO2Levels) {
        if (this.CO2Levels[key].cycle < min) {
          min = this.CO2Levels[key].cycle
        }
        if (this.CO2Levels[key].trend < min) {
          min = this.CO2Levels[key].trend
        }
      }
      return min
    },
    maxPointY () {
      let max = 0
      for (let key in this.CO2Levels) {
        if (this.CO2Levels[key].cycle > max) {
          max = this.CO2Levels[key].cycle
        }
        if (this.CO2Levels[key].trend > max) {
          max = this.CO2Levels[key].trend
        }
      }
      return max
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
        yaxis: {
          min: this.minPointY - 1,
          max: this.maxPointY + 1
        },
        theme: {
          mode: `dark`
        },
        colors: ['#4ecdc4','#278b85']
      }
    },
    apexChartSeries() {
      return [
        {
          name: 'CO2 level (PPM)',
          data: Object.keys(this.CO2Levels).map(key => this.CO2Levels[key].cycle),
        },
        {
          name: 'CO2 trend (PPM)',
          data: Object.keys(this.CO2Levels).map(key => this.CO2Levels[key].trend),
        },
      ]
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  cursor: default;
}
body {
  margin: 0;
  padding: 5em;
  background: hsl(204, 6%, 16%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  min-height: 100vh;
}
</style>

<style lang="scss" scoped>
.large-co2-label, .large-co2-value, .increases {
  width: max-content;
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
  // margin-top: 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.increases {
  display: flex;
  margin-top: .5em;
  opacity: .8;
}
.increase {
  text-align: center;
  font-size: 16px;
  width: max-content;
  margin-right: 30px;
}
.increase-number {
  font-size: 1.5em;
  font-weight: bold;
}
.z-index-1 {
  z-index: 1;
  position: relative;
}
</style>
