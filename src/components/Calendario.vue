<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="800">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                >
                Nueva vista
                </v-btn>
            </template>
            <v-card>
                <!-- <v-card-title class="headline">Use Google's location service?</v-card-title>
                <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text> -->
                <!-- <div>
                    Nombre: <br>
                    <input type="text" v-model="nombre">
                </div> -->
                <div class="contSecc">
                    <div class="titSec">Nueva visita</div>
                    <div class="gris">
                        <div class="titCol">Ingresa la información para realizr una nueva visita</div>
                        <div class="divCol spaceCol">
                            <div class="col12">
                                Usuario a asignar:<br>
                                <input type="text" placeholder="Nombres" v-model="nombre">
                            </div>					
                        </div>
                        <div class="divCol spaceCol">
                            <div class="col6">
                                Sucursal:<br>
                                <input type="text" placeholder="Nombres">
                            </div>					
                            <div class="col6">
                                Proyecto:<br>
                                <input type="text" placeholder="Nombres">
                            </div>									
                        </div>
                        <div class="divCol spaceCol">
                            <div class="col6">
                                Fase:<br>
                                <input type="text" placeholder="Nombres">
                            </div>					
                            <div class="col6">
                                Fecha de visita:<br>
                                <input type="text" placeholder="Nombres">
                            </div>									
                        </div>
                        <div class="btnCenter">
                            <a href="#" class="btn btnLimpiar"><div></div>Limpiar</a>
                            <a href="#" class="btn btnEditar"><div></div>Editar</a>
                            <a href="#" class="btn btnGuardar"><div></div>Guardar</a>
                        </div>
                    </div>
                </div>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">Disagree</v-btn>
                <v-btn color="green darken-1" text @click="dialog = false, agregarVisita()">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <FullCalendar :options="calendarOptions" ref="fullCalendar"/>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
/* import timeGridPlugin from '@fullcalendar/timegrid' */
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';

var eventos = [];

export default {
    name: 'HelloWorld',
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            nombre: 'juan',
            dialog: false,
            celda: null,
            calendarOptions: {
                plugins: [ dayGridPlugin, interactionPlugin ],
                locale: esLocale,
                initialView: 'dayGridMonth',
                headerToolbar: {
                left: 'agregarVista',
                center: 'title',
                right: 'prev,next,dayGridMonth,dayGridWeek,dayGridDay'
                },
                dateClick: function(info) {
                console.log(info.dayEl);
                /* alert('Clicked on: ' + info.dateStr);
                alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                alert('Current view: ' + info.view.type); */
                // change the day's background color just for fun
                // info.dayEl.style.backgroundColor = 'red';
                // var el = document.createElement('div');
                // el.classList.add('prueba');
                // info.dayEl.firstChild.appendChild(el);
                },
                events: [
                    { id:0, title: '6222 Recepción de obra', date: '2020-09-03T00:00:00' },
                    { id:1, title: 'event 2', date: '2020-09-04T02:08:09' }
                ],
                customButtons: {
                    agregarVista: {
                        text: '+ Nueva vista',
                        click: function() {
                            // let calendarApi = this.$refs.fullCalendar.getApi()
                            // console.log(this.$refs);
                            // alert('clicked the custom button!');
                            // this.calendarOptions.events.push({ title: 'event 3', date: '2020-09-05T02:08:09' });
                            // this.FullCalendar.addEventSource({ title: 'event 3', date: '2020-09-05T02:08:09' });
                        }
                    }
                },
                // addEventSource: function (event, element) {
                //     console.log(element);
                //     // element.data('event-id',event.id);
                // },
                // eventDidMount: this.agregarVisita(),
                eventDidMount: function(info) {
                    // Change background color of row
                    // info.el.style.backgroundColor = 'red';
                    /* var description = 'wfyubwyfubyuefbuyfbfr'; */
                    eventos.push(info.el);
                    // console.log(eventos);
                    // console.log(info.el);
                    // var celda = eventos[eventos.length - 1]

                    // var descriptionDiv = document.createElement('div');

                    // descriptionDiv.innerHTML = ` 
                    //     juanuwbfuyevfuvewfuyve<br>wygfwyefgyuewgfyuewgfuygewfyu
                    // `;

                    // celda.appendChild(descriptionDiv);
                    
                    // Change color of dot marker
                    // var dotEl = info.el.getElementsByClassName('fc-daygrid-event-dot')[0];
                    // if (dotEl) {
                    //     dotEl.style.borderColor = 'green';
                    // }
                    
                }
            }
        }
    },
    methods: {
        agregarVisita: function() {
            // console.log(this.$data-date);
            // let calendarApi = this.$refs.fullCalendar.getApi()
            // var data = document.getElementsByClassName('fc-daygrid-day');
            // console.log(calendarApi.getEventSources());
            // console.log(calendarApi.getEventById(1));
            this.calendarOptions.events.push({ title: 'event 3', date: '2020-09-05T02:08:09' });
            var agregarC = eventos[eventos.length - 1];
            console.log(agregarC)

            var descriptionDiv = document.createElement('div');

            descriptionDiv.innerHTML = ` 
                juanuwbfuyevfuvewfuyve<br>wygfwyefgyuewgfyuewgfuygewfyu
            `;

            eventos[eventos.length - 1].appendChild(descriptionDiv);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.prueba {
    height: 100px;
    width: 100px;
    background-color: aqua;
}
.fc-icon {
    height: unset;
}
.fc-event-time {
    display: none;
}
.v-application a {
    color: unset !important;
}
</style>
