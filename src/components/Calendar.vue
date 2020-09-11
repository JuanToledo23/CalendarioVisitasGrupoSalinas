<template>
    <div style="margin: 20px 30px;">
        <v-dialog v-model="dialog" persistent max-width="800">
            <template v-slot:activator="{ on, attrs }">
                <v-btn tile class="mr-4 btn-yellow font-size-11" @click="editingVisit = false, cleanForm()" v-bind="attrs" v-on="on">
                    <img src="../assets/img/mas.svg" class="btnIco">
                    Nueva visita
                </v-btn>
            </template>
            <v-card>
                <div class="contSecc">
                    <div class="titSec font-size-13" v-if="!editingVisit">Nueva visita</div>
                    <div class="titSec font-size-13" v-if="editingVisit">Editar visita</div>
                    <div class="gris">
                        <div class="titCol titDialog">Ingresa la información para realizar una nueva visita</div>
                        <div class="divCol spaceCol">
                            <div class="col12">
                                Usuario a asignar:<br>
                                <div class="pRelative">
                                    <input type="text" id="busca" placeholder="Buscar por número de empleado" v-model="visitShowed.nombre" @keyup="validateForm">
                                    <input type="submit" class="buscar" value="">
                                </div>
                            </div>					
                        </div>
                        <div class="divCol spaceCol">
                            <div class="col6">
                                Sucursal:<br>
                                <input type="text" placeholder="" v-model="visitShowed.sucursal" @keyup="validateForm">
                            </div>					
                            <div class="col6">
                                Proyecto:<br>
                                <v-select
                                    :items="proyectos"
                                    label=""
                                    solo
                                    v-model="visitShowed.proyecto"
                                    @change="validateForm"
                                    color="#ffeeb2"
                                ></v-select>
                            </div>									
                        </div>
                        <div class="divCol spaceCol">
                            <div class="col6">
                                Fase:<br>
                                <v-select
                                    :items="fases"
                                    label=""
                                    solo
                                    v-model="visitShowed.name"
                                    @change="validateForm"
                                ></v-select>
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
                                        <input type="text" class="date datapicker1" placeholder="dd/mm/aaaa" v-model="visitShowed.start" v-bind="attrs" v-on="on" @change="validateForm"> 
                                    </template>
                                    <v-date-picker v-model="visitShowed.start" @input="menu = false" header-color="#ffc900" color="#ffeeb2"></v-date-picker>
                                </v-menu>
                            </div>									
                        </div>
                    </div>
                </div>
                <div class="btnCenter">
                    <v-btn color="green darken-1" text tile class="mr-8 btn btn-gray" @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="green darken-1" text tile class="btn btn-yellow" @click="dialog = false, addVisit()" v-if="!editingVisit" :class="{ desac: !activeButton }">Crear visita</v-btn>
                    <v-btn color="green darken-1" text tile class="btn btn-yellow" @click="dialog = false, saveVisit()" v-if="editingVisit">Guardar cambios</v-btn>
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

                    <v-toolbar-title class="font-size-2" v-if="$refs.calendar && !showTittleDay">
                    <span style="color: #000">{{ $refs.calendar.title }}</span> <span v-if="showWeek" style="color: rgb(119 119 119)"> (Semana {{ week }}) </span>
                    </v-toolbar-title>
                    <v-toolbar-title class="font-size-2" v-if="showTittleDay">
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
                <v-sheet height="700" style="margin-top: 8px;">
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
                            <span class="dot" :style="{ backgroundColor: event.dotColor }"></span>
                            <div class="black--text">
                                {{ event.ceco }} <strong>  {{ event.name }} </strong>
                            </div>
                        </div>

                        <div class="separator event-container" layout="column" v-if="templateWeek">
                            <div class="event-content-week">
                                <span class="dot" :style="{ backgroundColor: event.dotColor }"></span>
                                <div>
                                    <div class="black--text content-space">
                                        {{ event.negocio }} - {{ event.ceco }} <br> 
                                        <strong>  {{ event.name }} </strong> <br>
                                        ({{ event.proyecto }}) <br>
                                    </div>
                                    <div class="black--text content-space">
                                        {{ event.sucursal }}
                                    </div>
                                    <div class="black--text content-space">
                                        {{ event.nombre }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="separator event-container" layout="column" v-if="templateDay">
                            <div class="event-content-day">
                                <span class="dot" :style="{ backgroundColor: event.dotColor }"></span>
                                <div class="w-100 d-flex-sb">
                                    <div class="black--text content-space">
                                        {{ event.negocio }} - {{ event.ceco }} - {{ event.sucursal }} <br> 
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
        <strong>Simbología</strong>
        <div class="simbologiaContainer">
            <div class="element">
                <span class="dot" :style="{ backgroundColor: colors.orange }"></span>
                <strong>PPR - Presta Prenda</strong>
            </div>
            <div class="element">
                <span class="dot" :style="{ backgroundColor: colors.green }"></span>
                <strong>DAZ - Dinero Azteca</strong>
            </div>
            <div class="element">
                <span class="dot" :style="{ backgroundColor: colors.cyan }"></span>
                <strong>ITK - Italika</strong>
            </div>
            <div class="element">
                <span class="dot" :style="{ backgroundColor: colors.yellow }"></span>
                <strong>EKT - Elektra</strong>
            </div>
            <div class="element">
                <span class="dot" :style="{ backgroundColor: colors.blue }"></span>
                <strong>OCC - Oficina de Crédito y Cobranza</strong>
            </div>
        </div>

        <v-dialog v-model="dialogInfo" persistent max-width="800">
            <v-card>
                <div class="contSecc">
                    <div class="titSec font-size-13" :style="{ borderColor: dialogContentInfo.color }">{{ dialogContentInfo.title }}</div>
                    <div class="gris">
                        <div class="infoContainer">
                            <img :src="getImgUrl(dialogContentInfo.img)" class="imgDialogInfo">
                            <div v-if="dialogContentInfo.text1.show" :class="{ strong: dialogContentInfo.text1.strong }"> {{dialogContentInfo.text1.text}} </div>
                            <div v-if="dialogContentInfo.text2.show" :class="{ strong: dialogContentInfo.text2.strong }"> {{dialogContentInfo.text2.text}} </div>
                            <div v-if="dialogContentInfo.text3.show" :class="{ strong: dialogContentInfo.text3.strong }"> {{dialogContentInfo.text3.text}} </div>
                        </div>
                    </div>
                </div>
                <div class="btnCenter">
                    <v-btn color="green darken-1" text tile class="mr-8 btn btn-gray" @click="dialogInfo = false" v-if="dialogContentInfo.secundaryBtn"> {{dialogContentInfo.secundaryBtnText}} </v-btn>
                    <v-btn color="green darken-1" text tile class="btn btn-yellow" @click="dialogInfo = false, dialogActions($event)"> {{dialogContentInfo.primaryBtnText}} </v-btn>
                </div>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
                dialog: false,
                dialogInfo: false,
                dialogContentInfo: {
                    'title': '',
                    'color': '',
                    'img': '',
                    'text1': { 'text': '', show: true, 'strong': false},
                    'text2': { 'text': '', show: true, 'strong': false},
                    'text3': { 'text': '', show: true, 'strong': false},
                    'secundaryBtn': false,
                    'secundaryBtnText': '',
                    'primaryBtnText': ''
                    
                },
                datePicker: new Date().toISOString().substr(0, 10),
                menu: false,
                groupButtons: undefined,
                focus: '',
                type: 'month',
                weekdays: [1, 2, 3, 4, 5, 6, 0],
                events: [
                    { ceco: '6222', negocio: 'PPR', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-08T00:00:00'), sucursal: 'Zitácuaro Revolución Sur, Michoacán.', nombre: 'Carlos Alberto  González Muñoz', color: '#ffe3cc', timed: false, dotColor: '#ff7500' },
                    { ceco: '2056', negocio: 'DAZ', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-09T00:00:00'), sucursal: 'Plaza Vitala Cancún, Q. Roo.', nombre: 'Roberto Martínez López', color: 'transparent', timed: false, dotColor: '#01c458' },
                    { ceco: '1234', negocio: 'ITK', name: 'Recepción de obra', proyecto: 'Reconstrucción', start: new Date('2020-09-10T00:00:00'), sucursal: 'Mega Río Verde, S.L.P.', nombre: 'Mauricio Sánchez Odregón', color: 'trannsparent', timed: false, dotColor: '#00b5dd' },
                    { ceco: '2138', negocio: 'EKT', name: 'Soft Opening', proyecto: 'Nueva', start: new Date('2020-09-10T00:00:00'), sucursal: 'Plaza Nuevo Mundo Cancún, Q. Roo.', nombre: 'Roberto Martínez López', color: 'transparent', timed: false, dotColor: '#ffca00' },
                    { ceco: '9612', negocio: 'OCC', name: 'Caminata', proyecto: 'Reconstrucción', start: new Date('2020-09-10T00:00:00'), sucursal: 'Progreso de Obregón, Hidalgo.', nombre: 'Roberto Martínez López', color: 'transparent', timed: false, dotColor: '#001d61' },
                    { ceco: '9613', negocio: 'PPR', name: 'Caminata', proyecto: 'Nueva', start: new Date('2020-09-10T00:00:00'), sucursal: 'Plaza Vitala Cancún, Q. Roo.', nombre: 'Juan Sánchez Morales', color: 'transparent', timed: false, dotColor: '#ff7500' },
                    { ceco: '9614', negocio: 'PPR', name: 'Caminata', proyecto: 'Nueva', start: new Date('2020-09-10T00:00:00'), sucursal: 'Plaza Vitala Cancún, Q. Roo.', nombre: 'Juan Sánchez Morales', color: 'transparent', timed: false, dotColor: '#ff7500' },
                    { ceco: '0123', negocio: 'EKT', name: 'Recepción de obra', proyecto: 'Reconstrucción', start: new Date('2020-09-11T00:00:00'), sucursal: 'Zacatenco deJuárez, Tlaxcala.', nombre: 'Jorge Adrán Martínez Nava', color: '#ffe3cc', timed: false, dotColor: '#ffca00' },
                    { ceco: '9603', negocio: 'ITK', name: 'Recepción de obra', proyecto: 'Nueva', start: new Date('2020-09-11T00:00:00'), sucursal: '20 de noviembre Sur, Michoacán.', nombre: 'Mariana Carol Cruz Muñoz', color: 'transparent', timed: false, dotColor: '#00b5dd' },
                    { ceco: '9876', negocio: 'ITK', name: 'Caminata', proyecto: 'Reconstrucción', start: new Date('2020-09-12T00:00:00'), sucursal: 'Plaza Tequisquiapan, Qro.', nombre: 'Edder Díaz Pichardo', color: 'transparent', timed: false, dotColor: '#00b5dd' },
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
                    'start': new Date().toISOString().substr(0, 10),
                    'sucursal': '',
                    'nombre': '',
                    'color': 'transparent',
                    'timed': false,
                    'dotColor': '#00b5dd'
                },
                editingVisit: false,
                selectedVisit: undefined,
                fases: ['Recepción de obra', 'Caminata', 'Soft Opening'],
                proyectos: ['Nueva', 'Reconstrucción', 'Tiendas nuevas'],
                activeButton: false
        }
    },
    mounted () { 
    },
    methods: {
        getImgUrl(img) {
            if(img) {
                var images = require.context('../assets/img/', false, /\.svg$/)
                return images('./' + img + ".svg")
            }
        },
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
            let dateAux = element.start
            if(element.start.toString().length > 10) {
                dateAux = element.start.toISOString().substr(0, 10)
            }
            this.visitShowed.ceco = element.ceco
            this.visitShowed.negocio = element.negocio
            this.visitShowed.name = element.name
            this.visitShowed.proyecto = element.proyecto
            this.visitShowed.start = dateAux
            this.visitShowed.sucursal = element.sucursal
            this.visitShowed.nombre = element.nombre
            this.visitShowed.timed = element.timed
            this.visitShowed.dotColor = element.dotColor
        },
        saveVisit() {
            if(new Date(this.visitShowed.start+'T00:00:00').toString().substr(0, 15) === new Date().toString().substr(0, 15)) {
                this.errorEdicionVisita()
            } else {
                this.events[this.selectedVisit].ceco = this.visitShowed.ceco
                this.events[this.selectedVisit].negocio = this.visitShowed.negocio
                this.events[this.selectedVisit].name = this.visitShowed.name
                this.events[this.selectedVisit].proyecto = this.visitShowed.proyecto
                this.events[this.selectedVisit].start = this.visitShowed.start
                this.events[this.selectedVisit].sucursal = this.visitShowed.sucursal
                this.events[this.selectedVisit].nombre = this.visitShowed.nombre
                this.events[this.selectedVisit].timed = this.visitShowed.timed
                this.events[this.selectedVisit].dotColor = this.visitShowed.dotColor
                this.edicionVisitaExitosa()
            }
        },
        deleteVisit (e) {
            this.confirmacionEliminacionVisita()
            const ceco = e.path[3].children[0].innerHTML.split('-')[1].replace(/ /g,'');
            const found = this.events.find(element => element.ceco === ceco);
            this.selectedVisit = this.events.indexOf(found)
        },
        addVisit () {
            if(this.visitShowed.start === new Date().toISOString().substr(0, 10)) {
                this.errorCreacionVisita()
            } else {
                this.editingVisit = false
                let event = { 
                    ceco: this.visitShowed.ceco, 
                    negocio: this.visitShowed.negocio,
                    name: this.visitShowed.name,
                    proyecto: this.visitShowed.proyecto,
                    start: new Date(this.visitShowed.start + 'T00:00:00'),
                    sucursal: this.visitShowed.sucursal,
                    nombre: this.visitShowed.nombre,
                    color: this.visitShowed.color,
                    timed: this.visitShowed.timed,
                    dotColor: this.colors.cyan,
                }
                this.events.push(event)
                this.creacionExitosaVista()
            }
        },
        edicionVisitaExitosa() {
            this.dialogContentInfo = {
                    'title': 'Edición de visita exitosa',
                    'color': '#ffc900',
                    'img': 'exito',
                    'text1': { 'text': 'Se realizó la edición de la visita correctamente.', show: true, 'strong': true},
                    'text2': { 'text': '', show: true, 'strong': false},
                    'text3': { 'text': '', show: true, 'strong': false},
                    'secundaryBtn': false,
                    'secundaryBtnText': '',
                    'primaryBtnText': 'Aceptar'
                }
                this.dialogContentInfo.text2.text = this.visitShowed.nombre
                this.dialogContentInfo.text3.text = this.visitShowed.start + ' ' + this.visitShowed.sucursal + ' / ' + this.visitShowed.proyecto + ' / ' + this.visitShowed.name
                this.dialogInfo = true
        },
        errorEdicionVisita() {
            this.dialogContentInfo = {
                    'title': 'Error en edición de visita',
                    'color': '#ff7909',
                    'img': 'error',
                    'text1': { 'text': '', show: false, 'strong': true},
                    'text2': { 'text': 'Tuvimos problemas al guardar los cambios en la edición de la visita,', show: true, 'strong': false},
                    'text3': { 'text': 'por favor reintentalo nuevamente.', show: true, 'strong': true},
                    'secundaryBtn': true,
                    'secundaryBtnText': 'Cancelar',
                    'primaryBtnText': 'Reintentar'
                }
                this.dialogInfo = true
        },
        creacionExitosaVista() {
            this.dialogContentInfo = {
                    'title': 'Creación exitosa de visita',
                    'color': '#ffca08',
                    'img': 'exito2',
                    'text1': { 'text': 'La visita se creó exitosamente', show: true, 'strong': true},
                    'text2': { 'text': '', show: false, 'strong': false},
                    'text3': { 'text': '', show: false, 'strong': true},
                    'secundaryBtn': false,
                    'secundaryBtnText': '',
                    'primaryBtnText': 'Aceptar'
                }
                this.dialogInfo = true
        },
        errorCreacionVisita() {
            this.dialogContentInfo = {
                    'title': 'Error en creación de visita',
                    'color': '#ff7909',
                    'img': 'error2',
                    'text1': { 'text': 'Tuvimos problemas al crear la visita,', show: true, 'strong': false},
                    'text2': { 'text': 'por favor reinténtalo nuevamente.', show: true, 'strong': true},
                    'text3': { 'text': '', show: false, 'strong': true},
                    'secundaryBtn': true,
                    'secundaryBtnText': 'Cancelar',
                    'primaryBtnText': 'Reintentar'
                }
                this.dialogInfo = true
        },
        confirmacionEliminacionVisita() {
            this.dialogContentInfo = {
                    'title': 'Confirmacón de eliminacion de visita',
                    'color': '#ff7909',
                    'img': 'alert',
                    'text1': { 'text': '¿Estas seguro de eliminar la visita?', show: true, 'strong': true},
                    'text2': { 'text': 'Recuerda que esta acción no es reversible.', show: true, 'strong': false},
                    'text3': { 'text': '', show: false, 'strong': true},
                    'secundaryBtn': true,
                    'secundaryBtnText': 'No, cancelar',
                    'primaryBtnText': 'Sí, eliminar'
                }
                this.dialogInfo = true
        },
        confirmacionLiberacionFase() {
            this.dialogContentInfo = {
                    'title': 'Confirmacón de liberación de fase',
                    'color': '#ff7909',
                    'img': 'icoGuardar',
                    'text1': { 'text': 'La fase tiene hallazgos pedientes por atender.', show: true, 'strong': false},
                    'text2': { 'text': '¿Estás seguro que deseas desbloquear la fase?', show: true, 'strong': true},
                    'text3': { 'text': '', show: false, 'strong': true},
                    'secundaryBtn': true,
                    'secundaryBtnText': 'No, cancelar',
                    'primaryBtnText': 'Sí, desbloquear'
                }
                this.dialogInfo = true
        },
        dialogActions (e) {
            switch (e.target.innerText) {
                case 'Sí, eliminar':
                    this.events.splice(this.selectedVisit, 1)
                    break;
                case 'Reintentar':
                    this.dialog = true
                    break;
            
                default:
                    break;
            }
        },
        validateForm() {
            if(this.visitShowed.nombre === '' || this.visitShowed.sucursal === '' ||  this.visitShowed.proyecto === '' || this.visitShowed.name === '' || this.visitShowed.start === '') {
                this.activeButton = false
            } else {
                this.activeButton = true
            }
        },
        cleanForm() {
            this.visitShowed = {
                    'ceco': '0000',
                    'negocio': 'ITK',
                    'name': '',
                    'proyecto': '',
                    'start': new Date().toISOString().substr(0, 10),
                    'sucursal': '',
                    'nombre': '',
                    'color': 'transparent',
                    'timed': false,
                    'dotColor': '#00b5dd'
                }
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

<style scoped>
@import url('../assets/css/vuetifyComponents/calendar.css');

.infoContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.imgDialogInfo {
    width: 110px;
    padding-bottom: 15px;
}

.strong {
    font-family: 'AvenirNextLTPro-Medium';
}

.simbologiaContainer {
    width: 100%;
    background-color: #f4f4f4;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

</style>
