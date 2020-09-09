<template>
    <div>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
        </v-btn>
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
                <v-toolbar flat color="white">
                    <!-- 
                        <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn> -->

                    <div class="arrows-container">
                        <v-btn text medium color="grey" @click="prev">
                            <v-icon medium>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn text medium color="grey" @click="next">
                            <v-icon medium>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>

                    <v-toolbar-title v-if="$refs.calendar">
                    <span style="color: #000">{{ $refs.calendar.title }}</span> <span v-if="showWeek" style="color: rgb(119 119 119)"> (Semana {{ week }}) </span>
                    </v-toolbar-title>
                    <v-toolbar-title>
                    <span style="color: #000">{{ tittleDay }}</span>
                    </v-toolbar-title>
                    
                    <div>
                        <v-btn-toggle
                            v-model="toggle_calendar"
                            mandatory
                            >
                            <v-btn @click="selectMonth">
                                Mes
                            </v-btn>
                            <v-btn @click="selectWeek">
                                Semana
                            </v-btn>
                            <v-btn @click="selectDay">
                                Día
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                </v-toolbar>
                </v-sheet>
                <v-sheet height="1000">
                <v-calendar
                    color="#ffeeb2"
                    ref="calendar"
                    v-model="focus"
                    :events="events"
                    :event-color="getEventColor"
                    :type="type"
                    :short-weekdays="false"
                    @click:event="viewDay2($event)"
                    @click:more="viewDay2($event)"
                    @click:date="updateDateSelected"
                    @change="updateRange"
                >
<!--                     <template v-slot:day-header="{ date }">
                        <v-row class="fill-height" >
                            <template v-if="evaluarFecha(date)[0]">
                                <div class="contenedor-evento">
                                    {{evaluarFecha(date)[1]}}
                                </div>
                            </template>
                        </v-row>
                    </template> -->
                    <!-- <template v-slot:day="{ date }">
                        <v-row class="fill-height" >
                            <template v-if="evaluarFecha(date)[0]">
                                <div class="contenedor-evento">
                                    {{evaluarFecha(date)[1]}}
                                </div>
                            </template>
                        </v-row>
                    </template> -->
                    <template v-slot:event="{ event }">
                        <div class="event-container" layout="column">
                            <div class="custom-event black--text">
                                <span class="dot" v-bind:style="{ backgroundColor: event.dotColor }"></span>
                                {{ event.name }}
                            </div>
                            <!-- <div>Juan Alberto Toledo Tello</div> -->
                        </div>
                    </template>
                    <!-- <template v-slot:event="{ event }">
                        <v-row class="fill-height" >
                            <template>
                                <div class="contenedor-evento">
                                    hello world, {{ event.name }}
                                </div>
                                <br>
                                <div>
                                    iuefyuerfuergf
                                </div>
                            </template>
                        </v-row>
                    </template> -->
                </v-calendar>
                </v-sheet>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
                toggle_calendar: undefined,
                focus: '',
                type: 'month',
                events: [],
                week: undefined,
                showWeek: false,
                selectedDate: new Date(),
                tittleDay: ':)',
                firstPrev: true,
        }
    },
    mounted () {
        this.$refs.calendar.checkChange()
        this.events.push({
            name: 'Evento 2',
            start: new Date('2020-09-10T00:00:00'),
            color: '#ffeeb2',
            timed: false,
            dotColor: 'red'
        });

        this.events.push({
            name: 'Evento 1',
            start: new Date('2020-09-17T00:00:00'),
            color: 'transparent',
            timed: false,
            dotColor: 'blue'
        });        
    },
    methods: {
        // viewDay ({ date }) {
        // this.focus = date
        // this.type = 'day'
        // },
        viewDay2 (e) {
            console.log(e);
 /*            let date = new Date(e.day.date);
            console.log(date.getWeek());
            this.week = date.getWeek(); */
            this.focus = e.day.date
            this.type = 'day'
            this.showWeek = false
        },
        getEventColor (event) {
        return event.color
        },
        setToday () {
            this.focus = ''
        },
        prev () {
            this.$refs.calendar.prev()
            this.updateDate(false)
            console.log(this.selectedDate.getWeek());
            this.week = this.selectedDate.getWeek();
        },
        next () {
            this.$refs.calendar.next()
            this.updateDate(true)
            console.log(this.selectedDate.getWeek());
            this.week = this.selectedDate.getWeek();
        },
        updateRange () {

        },
        selectWeek () {
            let date = new Date(this.selectedDate);
            console.log(date.getWeek());
            this.week = date.getWeek();
            this.type = 'week'
            this.showWeek = true
        },
        selectMonth () {
            this.type = 'month'
            this.showWeek = false
        },
        selectDay () {
            let date = new Date(this.selectedDate);
            console.log(date);
            date.setDate(date.getDate() + 1)
            let monthYear = this.$refs.calendar.title.split(' ')
            this.tittleDay = monthYear[0] + ' ' + date.getDate() + ' ' + monthYear[1]
            this.type = 'day'
            this.showWeek = false
        },
        updateDateSelected ({ date }) {
            console.log(date);
            this.selectedDate = new Date(date);
        },
        updateDate (direccion) {
            console.log(this.selectedDate)
            if(direccion) {
                this.selectedDate.setDate(this.selectedDate.getDate() + 1)
            } else {
                this.selectedDate.setDate(this.selectedDate.getDate() - 1)
            }
        }

/*         evaluarFecha(date) {
            let index = this.events.map((e) => { return e.date; }).indexOf(date);
            console.log(index)
            return [index !== -1, this.events[index]]
        }, */
        /* evaluarFecha(date) {
            let index = this.events.map((e) => { return e.date; }).indexOf(date);
            console.log(index);
            return [index !== -1, this.events[index]]
        } */
/*         eventsMap() {
            const map = {};
            this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
            return map
        } */
    }
}

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('../assets/css/vuetifyComponents/calendar.css');
</style>

