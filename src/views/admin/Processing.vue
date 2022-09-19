<template>
  <div>
    <NavView bcolor="primary" pagetitle="Sending" />
    <v-container>
      <v-card max-width="768" class="mx-auto mb-5" elevation="1">
        <v-card-text>
          <Origin @updat="vall => setOrigin(vall)" />
        </v-card-text>
      </v-card>

      <v-card v-if="error_msg" color="red" max-width="768" class="mx-auto mb-5 lighten-4" elevation="1">
        <v-card-text>
          <h1>ERROR!</h1>
          <p>{{ error_msg }}</p>
        </v-card-text>
      </v-card>

      <v-card max-width="768" class="mx-auto">
        <v-card-title>PACKAGE</v-card-title>
        <v-card-text>
          <v-form ref="pform">
            <v-text-field
              v-model="packag.price"
              label="Price"
              outlined
              dense
              append-icon="mdi-currency-usd"
              :rules="[v => !!v || 'This field is required']"
            ></v-text-field>

            <v-text-field
              v-model="packag.receiver_name"
              label="Receiver Name"
              outlined
              dense
              append-icon="mdi-account"
              :rules="[v => !!v || 'This field is required']"
            ></v-text-field>

            <v-text-field
              v-model="packag.receiver_phone_number"
              label="Receiver's Phone"
              outlined
              dense
              append-icon="mdi-phone"
              :rules="[v => !!v || 'This field is required']"
            ></v-text-field>

            <v-text-field
              v-model="packag.number_of_packages"
              label="Number Of Peices"
              outlined
              dense
              append-icon="mdi-123"
              :rules="[v => !!v || 'This field is required']"
            ></v-text-field>

            <label class="red--text">{{ inp_err }}</label>
            <Places
            v-model="country.label"
            placeholder="Delivery Town"
            @change="val => { setDelivery(val) }"
            :options="{countries:['zm']}"
            />
            

            <v-autocomplete
            v-model="selected_vehile"
            label="Select Vehicle"
            dense
            outlined
            prepend-inner-icon="mdi-bus"
            :items="vehicle_name_list"
            class="mt-6"
            :rules="[v=>!!v || 'This fiels is required']"
            @change="selectVehicle(selected_vehile)"
            :loading="vehicleDialog"
            ></v-autocomplete>


            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="packag.departure_date"
                  label="Departure Date"
                  hint="YYYY- format"
                  outlined
                  dense
                  persistent-hint
                  append-icon="mdi-calendar"
                  :rules="[v=>!!v || 'This fiels is required']"
                  v-bind="attrs"
                  @blur="packag.departure_date = packag.departure_date"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="packag.departure_date"
                no-title
                
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>

            <v-dialog
              ref="dialog"
              v-model="modal2"
              :return-value.sync="packag.departure_time"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="packag.departure_time"
                  label="Departure Time"
                  append-icon="mdi-clock-time-four-outline"
                  dense
                  outlined
                  readonly
                  :rules="[v=>!!v || 'This fiels is required']"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="modal2"
                v-model="packag.departure_time"
                full-width
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="modal2 = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(packag.departure_time)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>

            <v-text-field
            v-model="packag.sender_phone_number"
            label="Sender's Phone"
            outlined
            dense
            append-icon="mdi-phone"
            :rules="[v => !!v || 'This filed is required']"
            ></v-text-field>

            <v-btn @click="validatePackage" color="primary">Proceed</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>


    <!-- ****************************************** -->
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



    <!-- ******************************************************* 
    RECEIPT PRINT
    -->
    <v-dialog width="768" v-model="printDialog" scrollable persistent>
      <v-card color="grey" class="lighten-2">
        <v-app-bar dark dense color="primary" flat>
          <v-row no-gutters>
            <v-col>Confirm</v-col>
            <v-col align-self="center" class="text-right"><v-icon>mdi-times</v-icon></v-col>
          </v-row>
        </v-app-bar>
        <v-card-text>
          <div id="print" ref="label">
            <div v-for="n in print_count" :key="n" class="lables">
              <h3 class="text-center py-2">{{ courier.company_name }} COURIER</h3>
              <div class="sct">
                <p><b>RECEIVER'S DETAILS</b></p>
                <p>NAME: <b>{{ packagePriv.receiver_name}}</b></p>
                <p>PHONE NO.: <b>{{ packagePriv.receiver_phone_number}}</b></p>
              </div>
  
              <div class="sct">
                <p>PACKAGE ROUTE</p>
                <p class="text-center"><b>{{ origin.name }} - {{ packagePriv.delivery_town }}</b></p>
              </div>
  
              <div class="sct" style="padding:0 4px">
                <table width="100%">
                  <tr>
                    <td width="30%">
                      <p>NO. OF PIECES </p>
                    </td>
                    <td width="30%" style="text-align:center;border-right: 1px solid;padding: 12px 4px"><p><b>{{print_count}}</b></p></td>
                    <td width="30%" style="text-align:right; padding: 12px 4px">
                      <p class="text-center"><b>{{n}}/{{ print_count }}</b></p>
                    </td>
                  </tr>
                </table>
              </div>
  
              <div class="sct">
                <table width="100%">
                  <tr>
                    <td >
                      <p>CHARGE</p>
                    </td>
                    <td width="50%">
                      <p ><b>K{{ packagePriv.price }}</b></p>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="sct">
                <p>SENDER'S PHONE NUMBER</p>
                <p class="text-center"><b>{{ packagePriv.sender_phone_number }}</b></p>
              </div>
  
              <div class="sct text-center py-4 canvas">
                <p><b>TRACKING NUMBER</b></p>
                <p class="text-center">{{packagePriv.package_tracking_number}}</p>
                <br><br>
                <table>
                  <tr>
                    <td width="30%"></td>
                    <td width="30%"><qrcode-vue  :value="packagePriv.package_tracking_number" :size="200" level="H" /></td>
                    <td width="30%"></td>
                  </tr>
                </table>
                <p class="text-center my-4">{{packagePriv.processed_date_time}}</p>
              </div>
              <div class="capitalize">
                <p class="pa-0 ma-0">buy bus tickets online</p>
                <p class="pa-0 ma-0">buy football tickets online</p>
                <p class="pa-0 ma-0">buy event tickets online</p>
                <p class="pa-0 ma-0">download all1zed app </p>
                
                <p class="text-right pa-0 my-4" style="margin-top:4px">All1zed Package Tracking</p>
              </div>
            </div>

          </div>
          <v-divider class="mb-2"></v-divider>
          
        </v-card-text>
        <v-card-actions>
          <div class="text-right">
            <v-btn class="ml-4" color="grey" dark @click="printDialog = false">done <v-icon>mdi-check</v-icon></v-btn>
            <v-btn class="ml-4" color="primary" @click="printLabel">Print <v-icon>mdi-printer</v-icon></v-btn>
          </div>
        
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- ******************************************************* 
    RECEIPT CONFIRMATION
    -->
    <v-dialog width="400" v-model="confirmDialog" :scrollable="false">
      <v-card>
        <v-app-bar dark dense color="primary" flat>
          <v-row no-gutters>
            <v-col>Confirm</v-col>
            <v-col align-self="center" class="text-right"><v-icon>mdi-times</v-icon></v-col>
          </v-row>
        </v-app-bar>
        <v-card-text>
          <div id="confirm">
            <h3 class="text-center">{{ company_name }}</h3>
            <div class="sct">
              <h3>RECEIVER'S DETAILS</h3>
              <p>NAME: <b>{{ packag.receiver_name}}</b></p>
              <p>PHONE NO.: <b>{{ packag.receiver_phone_number}}</b></p>
            </div>

            <div class="sct">
              <p>PACKAGE ROUTE</p>
              <p class="text-center"><b>{{ origin.name }} <v-icon>mdi-arrow-right</v-icon> {{ packag.delivery_town }}</b></p>
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
              <p class="text-center"><b>{{ packag.price }}</b></p>
            </div>
            <div class="sct">
              <p>SENDER'S PHONE NUMBER</p>
              <p class="text-center"><b>{{ packag.sender_phone_number }}</b></p>
            </div>
          </div>
          <v-divider class="mb-2"></v-divider>
          <v-row no-gutters>
            <v-col>
              <v-btn color="grey" dark @click="confirmDialog = false">cancel</v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn color="primary" @click="packageProcessor">confirm</v-btn>
            </v-col>
          </v-row>
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
  import Places from 'vue-places';
  import '@/components/auth.vue'
  import Origin from '@/components/Origin.vue';
  import QrcodeVue from 'qrcode.vue'
  import print from 'vue-print-nb-element'

  // https://packages.pridezm.com/api/courier-companies

  export default {
      name: "ProcessingView",
      components: { NavView, Places, Origin, QrcodeVue},
      directives: { print },
      data: () => ({
        confirmDialog: false,
        printDialog:false,
        origin_input_dialog: false,
        company_name: 'Company name',
        print_count: 3,

        feed_dialog: false,
        feed_title: '',
        feed_message: '',
        err:null,

        courier: {},
        origin: {},

        packag: {
            receiver_name: "",
            receiver_phone_number: "",
            sender_phone_number: "",
            delivery_town: "",
            starting_town: "",
            vehicle: null,
            number_of_packages: 1,
            price: null,
            departure_date: null,
            departure_time: null,
            transit_date_time: null,
            ready_for_collection_date_time: null,
            collected_date_time: null,
            processed_status: true,
            transit_status: false,
            ready_for_collection_status: false,
            collected_status: false,
            current_coordinates: "-15.4165, 28.2821"
        },
        packagePriv:{},
        menu1: false,
        modal2: false,
        loading: null,
        error_msg: null,
        vehicles: null,
        vehicle_name_list: Array(),
        selected_vehile: null,
        inp_err: null,
        vehicleDialog: false,

        // places
        country: {
            label: null,
            data: {},
          },
        
      }),

      methods:{
        printLabel(){
          console.log(this.$refs.label)
          this.$htmlToPaper('print',{title:'lumas'})
        },
        validatePackage(){
          if(this.$refs.pform.validate()){
            if (!this.packag.delivery_town) {
              this.inp_err = 'Please select destination town'
              return
            }
            this.confirmDialog = true
          }
        },
        packageProcessor(){
          this.confirmDialog = false
          // console.log(this.packagc)
          if(this.$refs.pform.validate()){
            this.authVerify();
            this.loading = true
            const headers = {
              Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            // console.log(this.packag)
            this.axios.post('https://packages.pridezm.com/api/packages', this.packag, {headers}).then((res) =>{
              // console.log(res.data)
              this.packagePriv = res.data
              this.print_count = this.packagePriv.number_of_packages
              this.printDialog = true
              this.$refs.pform.reset()
              this.loading = false
            }).catch((err)=>{
              if (err.response.status==401) {
                this.packageProcessor()
              }else{
                this.error_msg = err
                this.feed_title = 'ERROR'
                this.feed_message = "An error occured! Please try again. "+err
                console.log(err.response)
                this.err = true
                this.feed_dialog =true
                this.loading = false
              }
            })
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
            this.origin = origin
            this.packag.starting_town = origin.name
            this.packag.current_coordinates = origin.latlng.lat+', '+origin.latlng.lng
            this.origin_input_dialog = false
          }
        },
        setDelivery(origin){
          this.packag.delivery_town = origin.name
          this.inp_err = null
        },
        selectVehicle(vehicle){
          this.packag.vehicle = this.vehicles.filter(arr => arr.vehicle_full_name == vehicle)[0].id
          this.packag.departure_time = this.vehicles.filter(arr => arr.vehicle_full_name == vehicle)[0].departure_time
        },
        getVehicles(){
          this.vehicleDialog = true
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
            }else{
              this.feed_title = 'ERROR'
              this.feed_message = "No vehicles found!"
              this.err = true
              this.feed_dialog =true
            }
            this.vehicleDialog = false
          }).catch((error) => {
            if (error.response.status==401) {
              this.getVehicles()
            }else{
              this.feed_title = 'ERROR'
              this.feed_message = "An error occured! Please try again. \n"+error.response.data.detail
              this.error = true
              this.feed_dialog =true
              this.vehicleDialog = false
            }
          })
        }
      },
      mounted(){
          this.getVehicles()
          if(!this.$cookies.isKey('origin')){
            this.origin_input_dialog = true
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

  .lables{
    height: 1000px;
    margin: 100px 0;
    background-color: #fff;
    border-radius: 5px;
  }
  .lables, #confirm{
    text-transform: uppercase;
    border:1px solid;
    margin-top: 12px;
  }
  .sct{
    border-top: 1px solid;
    padding: 12px 4px;
  }

  .sct.canvas div canvas{
    text-align: center;
    padding: auto;
    padding: 10px;
  }

  .bb-1{
    border-left: 1px solid;
  }

  .sct p{
    padding: 0;
    margin: 0;
    font-size: 18pt;
    font-family: 'helvetica';

  }
  .lables h3{
    font-size: 22pt;
    font-family: 'arial rounded mt';
  }

  .text-center{
    text-align: center;
  }

  .py-4{
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .text-right{
    text-align: right;
  }
  canvas{margin: auto;}
  .capitalize{
    text-transform: capitalize;
    font-size: 18pt;
    font-family: 'calibri light';
    margin-top: 8px;
  }
</style>