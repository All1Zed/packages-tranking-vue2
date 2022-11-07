<template>
  <div>
    <v-row>
        <v-col cols="12" md="7">
            {{courier.company_name}}
        </v-col>
        <v-col cols="12" md="5">
            <!-- replace with googl places -->
            <VueGooglePlaces
                api-key="AIzaSyA-1kCyANpA8K4_bSKsu-LV9TaOR9XgiEY"
                types="(cities)"
                country="zm"
                @placechanged="val => {setOrigin(val)}"
            >
                <v-text-field
                v-model="origin.name"
                label="Current Town"
                append-icon="mdi-map-marker"
                outlined
                dense
                clearable
                hide-details
                ></v-text-field>
            </VueGooglePlaces>
            
        </v-col>
    </v-row>
  </div>
</template>

<script>
import {VueGooglePlaces} from 'vue-google-places'
// import { VuetifyGooglePlaces } from 'vue-google-places'
export default {
    name:'OriginView',
    components:{ VueGooglePlaces },
    data:()=> ({
        // places
        origin: {
            name:null,
            location: null
        },
        courier: {},
        operator_name:''
    }),
    methods:{
        setOrigin(org){
            if (org) {
                this.origin.name = org.name
                this.origin.location = org.longitude+', '+org.latitude
                this.$cookies.set('origin', this.origin, '30d')
                this.$emit('updat', this.origin)
            }
        },
        
        onNoResult(){

        }
    },
    mounted(){
        if(this.$cookies.isKey('origin')){
            this.origin.name = this.$cookies.get('origin').name
            this.$emit('updat', this.$cookies.get('origin'))
        }
        
        
    },
    created(){
        if(this.$cookies.isKey('courier')){
            this.courier = this.$cookies.get('courier')
        }
    }
}
</script>

<style>

</style>