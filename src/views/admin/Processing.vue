<template>
  <div>
    <NavView v-if="printer_off" bcolor="primary" pagetitle="Sending" />
    <v-container v-if="printer_off">
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
                v-model="packag.processed_by"
                label="Processed by"
                placeholder="Staff name"
                append-icon="mdi-account"
                outlined
                dense
                clearable
                :rules="[v => !!v || 'This field is required']"
                disabled
                :loading="!packag.processed_by"
                ></v-text-field>

            <v-text-field
              v-model="packag.price"
              label="Price"
              outlined
              dense
              append-icon="mdi-currency-usd"
              :rules="[v => !!v || 'This field is required']"
            ></v-text-field>
            
            <v-text-field
              v-model="packag.package_value"
              label="Package Value"
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
            
            <v-autocomplete
              v-model="country"
              label="Change Country"
              outlined
              dense
              :items="countries"
              :rules="[v => !!v || 'This field is required']"
              @change="changeCountry"
            ></v-autocomplete>

            <!-- Google places auto complete  -->
            <label class="red--text">{{ inp_err }}</label>
            <VueGooglePlaces
                api-key="AIzaSyA-1kCyANpA8K4_bSKsu-LV9TaOR9XgiEY"
                types="(cities)"
                :country="countryIso"
                @placechanged="val => {setDelivery(val)}"
            >
                <v-text-field
                v-model="delivery_town_label"
                label="Delivery Town"
                outlined
                dense
                append-icon="mdi-map-marker"
                :rules="[v => !!v || 'This field is required']"
                ></v-text-field>
            </VueGooglePlaces>
            
            

            <v-select
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
            ></v-select>


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
                  hint="YYYY/MM/DD format"
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
      RECEIPT CONFIRMATION
      -->
      <v-dialog width="768" v-model="confirmDialog" :scrollable="true">
        <v-card>
          <v-app-bar dark dense color="primary" flat>
            <v-row no-gutters>
              <v-col>Confirm</v-col>
              <v-col align-self="center" class="text-right"><v-icon>mdi-times</v-icon></v-col>
            </v-row>
          </v-app-bar>
          <v-card-text>
          <package-receipt :packagData="packag" :courier="courier.company_name"/>
            <v-divider class="mb-2"></v-divider>
            <v-row no-gutters>
              <v-col>
                <v-btn color="grey" dark @click="confirmDialog = false">cancel</v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <!-- <v-btn color="primary" @click="beforeDownload">confirm</v-btn> -->
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
    </v-container>



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
          <!-- import receipt component -->
          <package-receipt :packagData="packagePriv" :courier="courier.company_name" />
          
        </v-card-text>
        <v-card-actions>
          <div class="text-right">
            <v-btn class="ml-4" color="grey" dark @click="$router.go($router.currentRoute)">done <v-icon>mdi-check</v-icon></v-btn>
            <v-btn class="ml-4" color="primary" @click="generateReport">download <v-icon>mdi-download</v-icon></v-btn>
            
            
          </div>
        
        </v-card-actions>
      </v-card>
    </v-dialog>



    <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :filename="packagePriv.receiver_name"
        :pdf-quality="1"
        :manual-pagination="true"
        :paginate-elements-by-height="950"
        pdf-format="a4"
        pdf-orientation="portrait"
        :margin="45"
 
        @progress="onProgress($event)"
        @hasStartedGeneration="hasStartedGeneration()"
        @hasGenerated="hasGenerated($event)"
        ref="html2Pdf"
    >
        <section slot="pdf-content">
          <package-receipt :packagData="packagePriv" :courier="courier.company_name" />
        </section>
    </vue-html2pdf>

    <!-- download dialog -->
    <v-dialog persistent v-model="downloadInd" max-width="400">
      <v-card>
        <v-app-bar color="blue" dark dense flat>
          <v-card-title>Downloading</v-card-title>
        </v-app-bar>
        <v-card-text class="pt-12 text-center">
          <p class="mb-2">{{ downloadMsg }}</p>
          <v-progress-linear rounded :value="dProgress" height="15">
            <template >
              <strong>{{ Math.ceil(dProgress) }}%</strong>
            </template>
          </v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!dDone" color="blue" text dark @click="downloadInd = false">ok</v-btn>
          <v-btn :disabled="dDone" color="grey" text dark @click="downloadInd = false">hide</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import NavView from '@/components/NavView.vue';
  import VueHtml2pdf from 'vue-html2pdf'
  import {VueGooglePlaces} from 'vue-google-places'
  // import Places from 'vue-places';
  import '@/components/auth.vue'
  import Origin from '@/components/Origin.vue';
  import PackageReceipt from '@/components/PackageReceipt.vue';

  // https://packages.pridezm.com/api/courier-companies

  export default {
      name: "ProcessingView",
      components: { NavView, Origin, PackageReceipt, VueHtml2pdf, VueGooglePlaces },
      directives: { print },
      data: () => ({
        confirmDialog: false,
        printDialog:false,
        origin_input_dialog: false,
        company_name: 'Company name',
        print_count: 1,
        countries: ['Zambia', 'Malawi', 'Namibia', 'Botswana', 'Zimbabwe'],
        country: 'Zambia',
        countryIso: 'zm',

        feed_dialog: false,
        feed_title: '',
        feed_message: '',
        err:null,
        printer_off: true, 
        startting_town_label:'',
        delivery_town_label:'',
        downloadInd: false,
        dProgress: 0,
        dDone: false,
        downloadMsg: 'Your file is downloading...',
        

        courier: {},
        origin: {},
        operator_name: '',

        packag: {
          processed_by: null,
          package_value: '0',
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
          
        
      }),

      methods:{
        changeCountry(country){
          switch (country) {
            case 'Zambia':
              this.countryIso = 'zm'
              break;
            
            case 'Malawi':
              this.countryIso = 'mw'
              break; 
            
            case 'Namibia':
              this.countryIso = 'na'
              break;
          
            case 'Botswana':
              this.countryIso = 'bw'
              break;

            case 'Zimbabwe':
              this.countryIso = 'zw'
              break;

            default:
              this.countryIso = 'zm'
              break;
          }
        },
        printLabel(){
          this.printer_off = false
          this.$print(PackageReceipt, {packagData:this.packagePriv, courier: this.courier.company_name})
        },
        generateReport () {
          this.downloadInd = true
          this.printDialog = false
            this.$refs.html2Pdf.generatePdf()
        },
        
        onProgress(val){
          this.dProgress = val
          if(val == 100){
            this.dDone = true
            this.downloadMsg = 'Your download is complete! The file has been save in your down load folder with the receiver\'s name.'
          }
        },
        // hasStartedGeneration(){},
        hasGenerated(){
          this.dDone = true
          this.downloadMsg = 'Your download is complete! The file has been save in your down load folder with the receiver\'s name.'
        },
        
        validatePackage(){
          if(this.$refs.pform.validate()){
            if (!this.packag.delivery_town) {
              this.inp_err = 'Please select destination town'
              return
            }
            if (!this.packag.processed_by) {
              this.getOperator()
            }
            this.confirmDialog = true
            // console.log(this.packag)
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
              this.getOperator()
              this.loading = false
            }).catch((err)=>{
              console.log(err)
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
            this.origin = origin.name
            this.packag.starting_town = origin.name
            // console.log(origin)
            this.packag.current_coordinates = origin.location
            this.origin_input_dialog = false
          }
        },
        setDelivery(origin){
          // console.log(origin)
          if(origin){
            this.packag.delivery_town = origin.name
            this.delivery_town_label = origin.name
            this.inp_err = null 
          this.inp_err = null
            this.inp_err = null 
          }
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
            if (error.response.status == 401) {
              this.getVehicles()
            }else{
              this.feed_title = 'ERROR'
              this.feed_message = "An error occured! Please try again. \n"+error.response.data.detail
              this.error = true
              this.feed_dialog =true
              this.vehicleDialog = false
            }
          })
        },
        getOperator(){
          this.authVerify();
          const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
          }
          this.axios.get('https://packages.pridezm.com/auth/users/me', {headers}).then((res) =>{
            this.packag.processed_by = res.data.username
          }).catch(()=>{
            
          })
        },
      },
      mounted(){
          this.getVehicles()
          this.getOperator()
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
    margin: 0 16px;
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