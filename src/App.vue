<template>
  <v-app>
    <v-main>
      <Calendar/>
    </v-main>
  </v-app>
</template>

<script>
import Calendar from './components/Calendar';

export default {
  name: 'App',

  components: {
    Calendar
  },

  data: () => ({
    
  }),
};
</script>

<style>
@import "./assets/css/styles.css";
</style>