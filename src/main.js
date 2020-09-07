import Vue from 'vue'
import App from './App.vue'
import fullCalendar from 'vue-fullcalendar'
import vuetify from './plugins/vuetify';

Vue.component('full-calendar', fullCalendar)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
