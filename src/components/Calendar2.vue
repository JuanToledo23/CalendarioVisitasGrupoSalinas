<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="800">
            <template v-slot:activator="{ on, attrs }">
                <v-btn tile class="mr-4 btn-yellow" @click="editingVisit = false" v-bind="attrs" v-on="on">
                    Nueva visita
                </v-btn>
            </template>
            <v-card>
                <div class="contSecc">
                    <div class="titSec" v-if="!editingVisit">Nueva visita</div>
                    <div class="titSec" v-if="editingVisit">Editar visita</div>
                    <div class="gris">
                        <div class="titCol">Ingresa la información para realizr una nueva visita</div>
                        <div class="divCol spaceCol">
                            <div class="col12">
                                Usuario a asignar:<br>
                                <input type="text" placeholder="Nombres" v-model="visitShowed.nombre">
                            </div>					
                        </div>
                        <div class="divCol spaceCol">
                            <div class="col6">
                                Sucursal:<br>
                                <input type="text" placeholder="Nombres" v-model="visitShowed.sucursal">
                            </div>					
                            <div class="col6">
                                Proyecto:<br>
                                <input type="text" placeholder="Nombres" v-model="visitShowed.proyecto">
                            </div>									
                        </div>
                        <div class="divCol spaceCol">
                            <div class="col6">
                                Fase:<br>
                                <input type="text" placeholder="Nombres" v-model="visitShowed.name">
                            </div>					
                            <div class="col6" style="text-align: initial;">
                                <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        Fecha de visita:<br>
                                        <input type="text" placeholder="Nombres" v-model="datePicker" v-bind="attrs" v-on="on"> 
                                    </template>
                                    <v-date-picker v-model="datePicker" @input="menu = false"></v-date-picker>
                                </v-menu>
                            </div>									
                        </div>
                    </div>
                </div>
                <div class="btnCenter">
                    <v-btn color="green darken-1" text tile @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="green darken-1" text tile class="btn-yellow" @click="dialog = false, addVisit()" v-if="!editingVisit">Crear visita</v-btn>
                    <v-btn color="green darken-1" text tile class="btn-yellow" @click="dialog = false, saveVisit()" v-if="editingVisit">Guardar cambios</v-btn>
                </div>
            </v-card>
        </v-dialog>
        <v-row class="fill-height">
            <v-col>
                <v-sheet height="64">
                <v-toolbar flat color="white">
                    <div class="arrows-container">
                        <v-btn text medium color="grey" @click="prev">
                            <v-icon large>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn text medium color="grey" @click="next">
                            <v-icon large>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>

                    <v-toolbar-title class="font-size-17" v-if="$refs.calendar && !showTittleDay">
                    <span style="color: #000">{{ $refs.calendar.title }}</span> <span v-if="showWeek" style="color: rgb(119 119 119)"> (Semana {{ week }}) </span>
                    </v-toolbar-title>
                    <v-toolbar-title class="font-size-17" v-if="showTittleDay">
                    <span style="color: #000">{{ tittleDay }}</span>
                    </v-toolbar-title>
                    
                    <div>
                        <v-btn-toggle
                            v-model="groupButtons"
                            mandatory
                            >
                            <v-btn @click="selectMonth" class="font-size-11 w90px">
                                Mes
                            </v-btn>
                            <v-btn @click="selectWeek" class="font-size-11 w90px">
                                Semana
                            </v-btn>
                            <v-btn @click="selectDay" class="font-size-11 w90px">
                                Día
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                </v-toolbar>
                </v-sheet>
                <v-sheet height="700">
                <v-calendar
                    color="#ffeeb2"
                    ref="calendar"
                    v-model="focus"
                    :events="events"
                    :event-color="getEventColor"
                    :type="type"
                    :short-weekdays="false"
                    :weekdays="weekdays"
                    @click:event="viewDay($event)"
                    @click:more="viewDayMore($event)"
                    @click:date="updateDateSelected"
                    @change="updateRange"
                >
                    <template v-slot:event="{ event }">
                        <div class="event-content-month" layout="column" v-if="templateMonth">
                            <span class="dot" v-bind:style="{ backgroundColor: event.dotColor }"></span>
                            <div class="black--text">
                                {{ event.ceco }} <strong>  {{ event.name }} </strong>
                            </div>
                        </div>

                        <div class="separator event-container" layout="column" v-if="templateWeek">
                            <div class="event-content-week">
                                <span class="dot" v-bind:style="{ backgroundColor: event.dotColor }"></span>
                                <div>
                                    <div class="black--text content-space">
                                        {{ event.negocio }} - {{ event.ceco }} <br> 
                                        <strong>  {{ event.name }} </strong> <br>
                                        ({{ event.proyecto }}) <br>
                                    </div>
                                    <div class="black--text content-space">
                                        {{ event.lugar }}
                                    </div>
                                    <div class="black--text content-space">
                                        {{ event.nombre }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="separator event-container" layout="column" v-if="templateDay">
                            <div class="event-content-day">
                                <span class="dot" v-bind:style="{ backgroundColor: event.dotColor }"></span>
                                <div class="w-100 d-flex-sb">
                                    <div class="black--text content-space">
                                        {{ event.negocio }} - {{ event.ceco }} - {{ event.lugar }} <br> 
                                        <strong>  {{ event.name }} </strong> ({{ event.proyecto }}) <br>
                                        <strong> {{ event.nombre }} </strong>
                                    </div>
                                    <div class="buttons-container">
                                        <div class="edit" @click="editVisit($event)"> 
                                            <img src="../assets/img/icoEditar.svg">
                                            <span>Editar visita</span>
                                        </div>
                                        <div class="delete" @click="deleteVisit($event)"> 
                                            <img src="../assets/img/icoEliminar.svg">
                                            <span>Eliminar visita</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                dialog: false,
                datePicker: new Date().toISOString().substr(0, 10),
                menu: false,
                groupButtons: undefined,
                focus: '',
                type: 'month',
                weekdays: [1, 2, 3, 4, 5, 6, 0],
                events: [
                    { ceco: '6222', negocio: 'PPR', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-08T00:00:00'), sucursal: 'Zitácuaro Revolución Sur, Michoacán.', nombre: 'Carlos Alberto  González Muñoz', color: 'transparent', timed: false, dotColor: '#ff7500' },
                    { ceco: '2056', negocio: 'DAZ', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-09T00:00:00'), sucursal: 'Plaza Vitala Cancún, Q. Roo.', nombre: 'Roberto Martínez López', color: 'transparent', timed: false, dotColor: '#01c458' },
                    { ceco: '1234', negocio: 'ITK', name: 'Recepción de obra', proyecto: 'Reconstrcción', start: new Date('2020-09-10T00:00:00'), sucursal: 'Mega Río Verde, S.L.P.', nombre: 'Mauricio Sánchez Odregón', color: '#ffeeb2', timed: false, dotColor: '#00b5dd' },
                    { ceco: '2138', negocio: 'EKT', name: 'Soft Opening', proyecto: 'Nueva', start: new Date('2020-09-10T00:00:00'), sucursal: 'Plaza Nuevo Mundo Cancún, Q. Roo.', nombre: 'Roberto Martínez López', color: 'transparent', timed: false, dotColor: '#ffca00' },
                    { ceco: '9612', negocio: 'OCC', name: 'Caminata', proyecto: 'Reconstrcción', start: new Date('2020-09-10T00:00:00'), sucursal: 'Progreso de Obregón, Hidalgo.', nombre: 'Roberto Martínez López', color: 'transparent', timed: false, dotColor: '#001d61' },
                    { ceco: '9613', negocio: 'PPR', name: 'Caminata', proyecto: 'Nueva', start: new Date('2020-09-10T00:00:00'), sucursal: 'Plaza Vitala Cancún, Q. Roo.', nombre: 'Juan Sánchez Morales', color: 'transparent', timed: false, dotColor: '#ff7500' },
                    { ceco: '9614', negocio: 'PPR', name: 'Caminata', proyecto: 'Nueva', start: new Date('2020-09-10T00:00:00'), sucursal: 'Plaza Vitala Cancún, Q. Roo.', nombre: 'Juan Sánchez Morales', color: 'transparent', timed: false, dotColor: '#ff7500' },
                    { ceco: '0123', negocio: 'EKT', name: 'Recepción de obra', proyecto: 'Reconstrcción', start: new Date('2020-09-11T00:00:00'), sucursal: 'Zacatenco deJuárez, Tlaxcala.', nombre: 'Jorge Adrán Martínez Nava', color: 'transparent', timed: false, dotColor: '#ffca00' },
                    { ceco: '9603', negocio: 'ITK', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-11T00:00:00'), sucursal: '20 de noviembre Sur, Michoacán.', nombre: 'Mariana Carol Cruz Muñoz', color: 'transparent', timed: false, dotColor: '#00b5dd' },
                    { ceco: '9876', negocio: 'ITK', name: 'Caminata', proyecto: 'Reconstrcción', start: new Date('2020-09-12T00:00:00'), sucursal: 'Plaza Tequisquiapan, Qro.', nombre: 'Edder Díaz Pichardo', color: 'transparent', timed: false, dotColor: '#00b5dd' },
                    { ceco: '5678', negocio: 'ITK', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-12T00:00:00'), sucursal: 'Obregón Cancún, Q. Roo.', nombre: 'Juan Santiago López Martínez', color: 'transparent', timed: false, dotColor: '#00b5dd' },
                ],
                colors: { 
                    'orange': '#ff7500',
                    'green': '#01c458',
                    'cyan': '#00b5dd',
                    'yellow': '#ffca00',
                    'blue': '#001d61'
                }
                ,
                week: undefined,
                showWeek: false,
                showTittleDay: false,
                selectedDate: new Date(),
                tittleDay: '',
                templateMonth: true,
                templateWeek: false,
                templateDay: false,
                visitShowed: {
                    'ceco': '0000',
                    'negocio': 'ITK',
                    'name': '',
                    'proyecto': '',
                    'start': '',
                    'sucursal': '',
                    'nombre': '',
                    'color': 'transparent',
                    'timed': false,
                    'dotColor': '#00b5dd'
                },
                editingVisit: false,
                selectedVisit: undefined
        }
    },
    mounted () { 
    },
    methods: {
        viewDay (e) {
            this.focus = e.day.date
            this.type = 'day'
            this.showWeek = false
            this.selectedDate = new Date(e.day.date+'T00:00:00')
            this.selectDay()
            this.showTittleDay = true
            this.groupButtons = 2
        },
        viewDayMore (e) {
            let strMonth = ''+e.month;
            if(strMonth.length === 1) strMonth = '0' + strMonth
            let date = '' + e.year + '-' + strMonth + '-' + e.day
            this.focus = date
            this.type = 'day'
            this.showWeek = false
            this.selectedDate = new Date(date+'T00:00:00')
            this.selectDay()
            this.showTittleDay = true
            this.groupButtons = 2
        },
        getEventColor (event) {
        return event.color
        },
        setToday () {
            this.focus = ''
        },
        prev () {
            this.$refs.calendar.prev()
            this.updateDateMove(false);
        },
        next () {
            this.$refs.calendar.next()
            this.updateDateMove(true);
        },
        updateRange () {

        },
        selectWeek () {
            this.week = this.selectedDate.getWeek();
            this.type = 'week'
            this.showWeek = true
            this.showTittleDay = false
            this.templateMonth = false
            this.templateWeek = true
            this.templateDay = false
        },
        selectMonth () {
            this.type = 'month'
            this.showWeek = false
            this.showTittleDay = false
            this.templateMonth = true
            this.templateWeek = false
            this.templateDay = false
        },
        selectDay () {
            let monthYear = this.$refs.calendar.title.split(' ')
            this.tittleDay = monthYear[0] + ' ' + this.selectedDate.getDate() + ', ' + monthYear[1]
            this.type = 'day'
            this.showWeek = false
            this.showTittleDay = true
            this.templateMonth = false
            this.templateWeek = false
            this.templateDay = true
        },
        updateDateSelected ({ date }) {
            this.selectedDate = new Date(date+'T00:00:00');
        },
        updateDateMove (move) {
            if(move) {
                switch (this.type) {
                    case 'week':
                        this.week++
                        break;
                    case 'day':
                        this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() + 1))
                        this.selectDay()
                        break;
                
                    default:
                        break;
                }
            } else {
                switch (this.type) {
                    case 'week':
                        this.week--
                        break;
                    case 'day':
                        this.selectedDate = new Date(this.selectedDate.setDate(this.selectedDate.getDate() - 1))
                        this.selectDay()
                        break;
                
                    default:
                        break;
                }
            }
        },
        editVisit (e) {
            this.editingVisit = true
            this.dialog = true
            const ceco = e.path[3].children[0].innerHTML.split('-')[1].replace(/ /g,'');
            const found = this.events.find(element => element.ceco === ceco);
            this.selectedVisit = this.events.indexOf(found)
            const element = this.events[this.selectedVisit]
            this.visitShowed.ceco = element.ceco
            this.visitShowed.negocio = element.negocio
            this.visitShowed.name = element.name
            this.visitShowed.proyecto = element.proyecto
            this.visitShowed.start = element.start
            this.visitShowed.sucursal = element.sucursal
            this.visitShowed.nombre = element.nombre
            this.visitShowed.timed = element.timed
            this.visitShowed.dotColor = element.dotColor
        },
        saveVisit() {
            this.events[this.selectedVisit].ceco = this.visitShowed.ceco
            this.events[this.selectedVisit].negocio = this.visitShowed.negocio
            this.events[this.selectedVisit].name = this.visitShowed.name
            this.events[this.selectedVisit].proyecto = this.visitShowed.proyecto
            this.events[this.selectedVisit].start = this.visitShowed.start
            this.events[this.selectedVisit].sucursal = this.visitShowed.sucursal
            this.events[this.selectedVisit].nombre = this.visitShowed.nombre
            this.events[this.selectedVisit].timed = this.visitShowed.timed
            this.events[this.selectedVisit].dotColor = this.visitShowed.dotColor
        },
        deleteVisit (e) {
            const ceco = e.path[3].children[0].innerHTML.split('-')[1].replace(/ /g,'');
            const found = this.events.find(element => element.ceco === ceco);
            this.events.splice(this.events.indexOf(found), 1)
        },
        addVisit () {
            this.editingVisit = false
            let event = { 
                ceco: this.visitShowed.ceco, 
                negocio: this.visitShowed.negocio,
                name: this.visitShowed.name,
                proyecto: this.visitShowed.proyecto,
                start: new Date(this.datePicker + 'T00:00:00'),
                sucursal: this.visitShowed.sucursal,
                nombre: this.visitShowed.nombre,
                color: this.visitShowed.color,
                timed: this.visitShowed.timed,
                dotColor: this.colors.cyan,
            }
            this.events.push(event)
        }
    }
}

Date.prototype.getWeek = function() {
    let date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    let week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('../assets/css/vuetifyComponents/calendar.css');
</style>

