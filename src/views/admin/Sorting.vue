<template>
  <div>
    <NavView bcolor="pink" pagetitle="Sorting" />
    <v-container >
      <v-card max-width="768" class="mx-auto mb-5" elevation="1">
        <v-card-text>
          <Origin @updat="vall => setOrigin(vall)" />
        </v-card-text>
      </v-card>

      <v-card elevation="1" max-width="769" class="mx-auto">
        <v-card-text class="text-center">
          <v-text-field
          v-model="tracking_number"
          label="Enter Tracking Number"
          outlined
          dense
          append-outer-icon="mdi-magnify"
          :rules="[v => !!v  || 'Enter tracking number!']"
          @keyup="sortPackage(tracking_number)"
          @click:append-outer="sortPackage(tracking_number)"
          ></v-text-field>
          <v-btn class="my-2" dark color="green"  @click="sortPackage(tracking_number)">sort</v-btn>
          <h1 class="my-1 font-weight-light">OR</h1>
          <v-btn @click="scannerD = !scannerD" dark color="pink" class="white--text lighten-2">scan qrcode</v-btn>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- camera dialog -->
    <v-dialog max-width="768" class="mx-auto" v-model="scannerD" persistent>
      <v-card color="blue">
        <v-app-bar color="primary" dark dense>
          <v-row>
            <v-col><h2 class="font-weight-light">Scanner</h2></v-col>
            <v-spacer></v-spacer>
            <v-col class="text-right">
              <v-btn icon small @click="scannerD=!scannerD">
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-app-bar>
        <ScannerView v-if="scannerD" class="pa-1" @scanned="sortPackage($event)" />
      </v-card>
    </v-dialog>

    <!-- ******************************************************* 
    PACKAGE PREVIEW
    -->
    <v-dialog width="768" v-model="packagePreview" scrollable persistent>
      <v-card v-if="packagePreview">
        <v-app-bar dark dense color="primary" flat>
          <v-row no-gutters>
            <v-col>Confirm</v-col>
            <v-col align-self="center" class="text-right"><v-icon>mdi-times</v-icon></v-col>
          </v-row>
        </v-app-bar>
        <v-card-text>
          <div id="print">
            <h3 class="text-center">{{ company_name }}</h3>
            <div class="sct">
              <p><b>RECEIVER'S DETAILS</b></p>
              <p>NAME: <b>{{ packag.receiver_name}}</b></p>
              <p>PHONE NO.: <b>{{ packag.receiver_phone_number}}</b></p>
            </div>

            <div class="sct">
              <p>PACKAGE ROUTE</p>
              <p class="text-center"><b>{{ packag.starting_town }} - {{ packag.delivery_town }}</b></p>
            </div>

            <div class="sct">
              <v-row no-gutters>
                <v-col>
                  <p>NO. OF PIECES</p>
                </v-col>
                <v-col class="bb-1">
                  <p class="text-center"><b>{{ packag.number_of_packages }}</b></p>
                </v-col>
              </v-row>
            </div>

            <div class="sct">
              <p>CHARGE</p>
              <p class="text-center"><b>K{{ packag.price }}</b></p>
            </div>
            <div class="sct">
              <p>SENDER'S PHONE NUMBER</p>
              <p class="text-center"><b>{{ packag.sender_phone_number }}</b></p>
            </div>

            <div class="sct text-center py-4 canvas">
              <p><b>TRACKING NUMBER</b></p>
              <p class="text-center mb-2">{{packag.package_tracking_number}}</p>
              <qrcode-vue  :value="packag.package_tracking_number" :size="200" level="H" />
              <p class="text-centermt-2">{{packag.processed_date_time}}</p>
            </div>
            <div class="capitalize">
              <p class="pa-0 ma-0">buy bus tickets online</p>
              <p class="pa-0 ma-0">buy football tickets online</p>
              <p class="pa-0 ma-0">buy event tickets online</p>
              <p class="pa-0 ma-0">download all1zed app </p>
              <p class="text-right pa-0 ma-0">All1zed Package Tracking</p>
            </div>

          </div>
          <v-divider class="mb-2"></v-divider>
          
        </v-card-text>
        <v-card-actions>
          <div class="text-right">
            <v-btn color="grey" class="mx-2" dark @click="packagePreview = false">cancel</v-btn>
            <v-btn color="success" class="mx-2" dark @click="packagePreview = false">Confirm</v-btn>
            <v-btn color="primary" class="mx-2" @click="getVehicles">In transit</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- IN TRANSIT DIALOG -->
    <v-dialog max-width="768" persistent v-model="intransit_dialog">
      <v-card>
        <v-app-bar dark dense flat color="primary">Select New Vehicle</v-app-bar>
        <v-card-text>
          <h2>Package Destination: {{ packag ? packag.delivery_town : '' }}</h2>
          <p>Select a vehicle that goes to <b>{{ packag ? packag.delivery_town : '' }}</b></p>
          <v-form ref="tform" class="mt-9">
            <v-autocomplete
            v-model="selected_vehile"
            label="Select New Vehicle"
            dense
            outlined
            prepend-inner-icon="mdi-bus"
            :items="vehicle_name_list"
            class="mt-6"
            :rules="[v=>!!v || 'This fiels is required']"
            @change="selectVehicle(selected_vehile)"
            ></v-autocomplete>
            <v-btn class="mx-2" dark color="grey" @click="intransit_dialog = false">cancel</v-btn>
            <v-btn class="mx-2" @click="validateTransitPackage" color="primary">Proceed</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loading" max-width="100" persistent>
        <v-card>
            <v-card-text class="pt-4">
                <v-progress-circular
                color="primary"
                indeterminate
                size="50"
                width="5"
                >wait...</v-progress-circular>
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- origin input dialog -->
    <v-dialog v-model="origin_input_dialog" max-width="400" persistent>
        <v-card height="400">
            <v-app-bar color="primary" dark dense flat>
                <v-card-title>Select your current town</v-card-title>
            </v-app-bar>
            <div>
                <v-progress-linear color="orange" indeterminate></v-progress-linear>
            </div>
            <v-card-text class="mt-9">
              <Origin @updat="vall => setOrigin(vall)" />
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- feed baack dialog -->
    <v-dialog v-model="feed_dialog" max-width="400">
      <v-card>
        <v-app-bar dense flat dark :color="err?'red':'green'">
          <v-card-title>{{feed_title}}</v-card-title>
        </v-app-bar>
        <v-card-text>
          <p class="my-9">{{feed_message}}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="feed_dialog = false" :color="err?'red':'green'" dark>Ok<v-icon right>mdi-check</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import NavView from '@/components/NavView.vue';
import ScannerView from '@/components/ScannerView.vue';
import Origin from '@/components/Origin.vue';
import QrcodeVue from 'qrcode.vue'

  export default {
    components: { NavView, ScannerView, Origin, QrcodeVue },
    name: 'SortingView',
    data: () => ({
      scannerD: false,
      packagePreview: false,
      intransit_dialog: false,
      origin_input_dialog: false,

      feed_dialog: false,
      feed_title: '',
      feed_message: '',
      err:null,

      vehicles: null,
      vehicle_name_list: Array(),
      selected_vehile: null,
      inp_err: null,
      starting_town: null,

      tracking_number: '',
      loading: null,
      error_msg: null,
      packag: null,
      printDialog: false,
      company_name: '',
      transit_vehicle: '',
      transit_departure_time: '',
    }),
    methods:{
      sortPackage(num){
        if(num){
          this.scannerD = false
          this.loading = true
          this.$cookies.set('package', num)
          this.authVerify();
          const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
          }
          this.axios.post('https://packages.pridezm.com/api/sort',{tracking_number:num, town: this.starting_town}, {headers}).then((res) =>{
            if (res.status == 200) {
              this.packag = res.data
              this.tracking_number = null
              if (this.packag.delivery_town == this.starting_town) {
                this.feed_title = 'SUCCESS'
                this.feed_message = "Package has been updated successfully."
                this.feed_dialog =true
                this.err = false
                this.tracking_number = ''
                this.loading = false
              } else {
                this.getVehicles()
              }
              
            } else {
              this.feed_title = 'ERROR'
              this.feed_message = "An error occured! Please try again."
              this.err = true
              this.feed_dialog =true
            }
          }).catch((err)=>{
            this.error_msg = err.response.data.detail
            this.feed_title = 'ERROR'
            this.feed_message = "An error occured! Please try again."
            this.err = true
            this.feed_dialog =true
            this.loading = false
          })
        }
      },
      changeVehicle(vehicle_id, num){
        if(num){
          this.scannerD = false
          this.loading = true
          this.$cookies.set('package', num)
          this.authVerify();
          const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
          }
          console.log({"tracking_number":num, "vehicle_id": vehicle_id})
          this.axios.post('https://packages.pridezm.com/api/sort', {"tracking_number":num, "vehicle_id": vehicle_id}, {headers}).then((res) =>{
            if (res.status == 200) {
              this.feed_title = 'SUCCESS'
              this.feed_message = "Package has been updated successfully."
              this.feed_dialog =true
              this.err = false
              this.tracking_number = ''
            } else {
              this.feed_title = 'ERROR'
              this.feed_message = "An error occured! Please try again."
              this.err = true
              this.feed_dialog =true
            }
            this.loading = false
          }).catch((err)=>{
            this.error_msg = err.response.data.detail
            this.intransit_dialog = true
            this.loading = false
          })
        }
      },
      validateTransitPackage(){
        if(this.$refs.tform.validate()){
          this.intransit_dialog = false
          this.changeVehicle(this.transit_vehicle, this.packag.package_tracking_number)
        }
      },
      authVerify(){
        let token = 'null'
        if(this.$cookies.isKey('access_token')){
            token = this.$cookies.get('access_token')
            this.axios.post('https://packages.pridezm.com/auth/jwt/verify', {'token':token}).then(()=>{
            }).catch(()=>{
                this.refreshAuth()
            })
        }else{
          this.$router.push('login')
        }
      },
      refreshAuth(){
        let token = 'null'
        if(this.$cookies.isKey('refresh_token')){
          token = this.$cookies.get('refresh_token')
          this.axios.post('https://packages.pridezm.com/auth/jwt/refresh', {'refresh':token}).then((res)=>{
              this.$cookies.set('access_token', res.data.access, '1d')
          }).catch(()=>{
              this.$router.push('login')
          })
        }else{
          this.$router.push('login')
        }
      },
      setOrigin(origin){
        if (origin) {
            this.starting_town = origin.name
            this.origin_input_dialog = false
        }
      },
      setDelivery(origin){
        this.packag.delivery_town = origin.name
      },
      selectVehicle(vehicle){
        this.transit_vehicle = this.vehicles.filter(arr => arr.vehicle_full_name == vehicle)[0].id
        this.transit_departure_time = this.vehicles.filter(arr => arr.vehicle_full_name == vehicle)[0].departure_time
      },
      getVehicles(){
        this.loading = true
        this.packagePreview = false
        this.authVerify();
        const headers = {
          Authorization: 'JWT '+this.$cookies.get('access_token'),
        }
        this.axios.get('https://packages.pridezm.com/api/vehicles', {headers}).then((res) =>{
          if(res.data.length > 0){
            this.vehicles = res.data

            for (let index = 0; index < this.vehicles.length; index++) {
              this.vehicle_name_list.push(this.vehicles[index].vehicle_full_name);
            }
          }
          this.loading = false
          this.intransit_dialog = true
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted(){
      if(!this.$cookies.isKey('origin')){
        this.origin_input_dialog = true
      }
    }
}
</script>
