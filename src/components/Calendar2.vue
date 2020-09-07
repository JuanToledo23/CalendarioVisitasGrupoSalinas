<template>
    <div>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
        </v-btn>
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
                <v-toolbar flat color="white">
                    <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <div>
                        <v-btn-toggle
                            v-model="toggle_exclusive"
                            mandatory
                            >
                            <v-btn @click="type = 'month'" ref='btn_mes'>
                                Mes
                            </v-btn>
                            <v-btn @click="type = 'week'" ref='btn_semana'>
                                Semana
                            </v-btn>
                            <v-btn @click="type = 'day'" ref='btn_dia'>
                                Día
                            </v-btn>
                            </v-btn-toggle>
                    </div>
                </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                <v-calendar
                    color="yellow"
                    ref="calendar"
                    v-model="focus"
                    :events="events"
                    :event-color="getEventColor"
                    :type="type"
                    @click:event="viewDay2($event)"
                    @change="updateRange"
                >
                    <template v-slot:day-header="{ date }">
                    <v-row class="fill-height" >
                        <template v-if="evaluarFecha(date)[0]">
                            <div class="contenedor-evento" >
                                {{evaluarFecha(date)[1].date}}
                            </div>
                        </template>
                    </v-row>
                    </template>
                    <template v-slot:day="{ date }">
                    <v-row class="fill-height" >
                        <template v-if="evaluarFecha(date)[0]">
                            <div class="contenedor-evento" >
                                {{evaluarFecha(date)[1].date}}
                            </div>
                        </template>
                    </v-row>
                    </template>
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
                toggle_exclusive: undefined,
                focus: '',
                type: 'month',
                events: [],
        }
    },
    mounted () {
        this.$refs.calendar.checkChange()
        this.events.push({
            name: 'Evento 2',
            start: new Date('2020-09-09T00:00:00'),
            end: new Date('2020-09-09T12:00:00'),
            color: 'transparent',
            timed: false,
            date: '2020-09-09',
            seleccionado: false
        });

        this.events.push({
            name: 'Evento 1',
            start: new Date('2020-09-10T00:00:00'),
            end: new Date('2020-09-10T12:00:00'),
            color: 'transparent',
            timed: false,
            date: '2020-09-10',
            seleccionado: false
        });
    },
    methods: {
        // viewDay ({ date }) {
        // this.focus = date
        // this.type = 'day'
        // },
        viewDay2 (e) {
            this.focus = e.day.date
            this.type = 'day'
        },
        getEventColor (event) {
        return event.color
        },
        setToday () {
        this.focus = ''
        },
        prev () {
        this.$refs.calendar.prev()
        },
        next () {
        this.$refs.calendar.next()
        },
        updateRange () {

        },
        evaluarFecha(date) {
            let index = this.events.map((e) => { return e.date; }).indexOf(date);
            return [index !== -1, this.events[index]]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* Calendar */
.v-application .white--text {
    color: #000000 !important;
}
.v-application .pl-1::before {
    content:"\A";
    width:10px;
    height:10px;
    border-radius:50%;
    background: #b83b3b;
    display:inline-block;
    margin-right: 5px;
}

/* .v-application .pl-1 > strong {
    display: none;
} */

.v-application .pl-1 {
    color: black;
}

.contenedor-evento {
    color: red;
}

.row {
    margin-right: unset !important;
    margin-left: unset !important;
}

/* Fin Calendar */
</style>
