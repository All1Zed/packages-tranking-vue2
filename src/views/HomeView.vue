<template>
  <div>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            app
        >
            <v-list dense>
              <v-list-item link to="/">
                <v-list-item-icon>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/login">
                <v-list-item-icon>
                  <v-icon>mdi-lock</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item>
            </v-list>
        </v-navigation-drawer>
    
        <v-app-bar app color="primary" dark>
            <v-row>
              <v-col class="text-left">
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                <!-- logo -->
              </v-col>
              <v-spacer></v-spacer>
              <v-col align-self="center" class="text-right">
              </v-col>
            </v-row>
    
        </v-app-bar>
    </div>

    <v-container >
      <v-card elevation="1" max-width="769" class="mx-auto">
        <v-card-text class="text-center">
          <v-text-field
          v-model="tracking_number"
          label="Enter Tracking Number"
          outlined
          dense
          append-outer-icon="mdi-magnify"
          :rules="[v => !!v  || 'Enter tracking number!']"
          @click:append-outer="trackPackage(tracking_number)"
          @keyup.enter="trackPackage(tracking_number)"
          ></v-text-field>
          <v-btn class="my-2" dark color="pink" @click="trackPackage(tracking_number)">Track</v-btn>
          <h1 class="my-1 font-weight-light">OR</h1>
          <v-btn @click="scannerD = !scannerD" dark color="primary">scan qrcode</v-btn>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- <v-container > -->
    <v-container v-if="packag">
        <v-card elevation="1" max-width="768" class="mx-auto">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>Package Status</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-timeline dense>
                            <v-timeline-item icon="mdi-check">
                                <h2 class="font-weight-light">PROCESSED</h2>
                                <p><span>{{ packag.processed_date_time }}</span> - Received at LUSAKA Sorting Facility and processed for Dispatch</p>
                            </v-timeline-item>
                            <v-timeline-item v-if="packag.transit || packag.ready_for_collection_status" :icon="packag.transit?'mdi-map-marker-check': ''" :color="packag.transit || packag.ready_for_collection_status? 'primary' : 'grey'" >
                                <h2 class="font-weight-light">IN TRANSIT</h2>
                                <p>{{ packag.transit_departure_time }} - Kindly see the map below for real time package location.</p>
                                <p>18-06-2022 16:00 - <span>{{ packag.transit_message}}</span></p>
                            </v-timeline-item>
                            <v-timeline-item v-if="packag.ready_for_collection_status" :icon="packag.ready_for_collection_status?'mdi-check': ''" :color="packag.ready_for_collection_status? 'primary' : 'grey'">
                                <h2 class="font-weight-light">READY FOR COLLECTION</h2>
                                <p><span>{{ packag.ready_for_collection_date_time}}</span> - Package is ready for collection at {{packag.delivery_town}} Station.</p>
                            </v-timeline-item>
                            <v-timeline-item v-if="packag.collected_status" :icon="packag.collected_status?'mdi-check': ''" :color="packag.collected_status? 'primary' : 'grey'">
                                <h2 class="font-weight-light">COLLECTED</h2>
                                <p><span>{{ packag.collected_date_time }}</span> - Package collected. Thanks for using {companyName}</p>
                            </v-timeline-item>
                        </v-timeline>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <MapsView v-if="packag.transit" :package_coord="packag.current_coordinates" />
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
        <ScannerView v-if="scannerD" class="pa-1" @scanned="trackPackage($event)" />
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
  </div>
</template>

<script>
// import NavView from '@/components/NavView.vue';
import ScannerView from '@/components/ScannerView.vue';
import MapsView from '@/components/MapsView.vue';
  export default {
    data: () => ({
      scannerD: false,
      tracking_number: '',
      loading: null,
      error_msg: null,
      packag: null,
      drawer : null,
      token:null,
    }),
    components: { ScannerView, MapsView },
    methods:{
      authVerify(){
        this.axios.post('https://packages.pridezm.com/auth/jwt/create', {'username':'app', 'password':'All1Zed2022!'}).then((res)=>{
          this.token = res.data.access
          return this.token
        }).catch((err)=>{
          alert(err)
          return false
        })
      },
      trackPackage(num){
        if(num){
          this.scannerD = false
          this.loading = true
          this.$cookies.set('package', num)

          this.axios.post('https://packages.pridezm.com/auth/jwt/create', {'username':'app', 'password':'All1Zed2022!'}).then((res)=>{
            this.token = res.data.access
            // console.log(res.data.access);
            const headers = {
              Authorization: 'JWT '+this.token,
            }
            this.axios.get('https://packages.pridezm.com/api/packages/'+num, {headers}).then((res) =>{
              // console.log(res.data)
              this.packag = res.data
              this.loading = false
            }).catch((err)=>{
              this.error_msg = err.response.data.detail
              alert(err)
              this.loading = false
            })
          }).catch((err)=>{
            alert(err)
            this.loading = false
          })
        }
      },
      
    },
    mounted(){
      if(this.$cookies.isKey('package')){
        this.tracking_number = this.$cookies.get('package')
      }
    }
}
</script>

<style>
  .psd{
    /* background: url('All1Zed2022!.png'); */
  }
</style>
