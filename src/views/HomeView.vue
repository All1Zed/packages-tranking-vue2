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
      <v-card flat class="pb-9 mx-auto" max-width="1080">
        <v-carousel
          cycle
          hide-delimiter-background
          show-arrows-on-hover
          :height="dheight"
          ref="slideshow"
          >
            <v-carousel-item >
              <v-img src="../assets/1024 x 500.png" width="100%"></v-img>
            </v-carousel-item>
            
            <v-carousel-item >
              <v-img src="../assets/mmmmM.jpg" width="100%"></v-img>
            </v-carousel-item>
            
            <v-carousel-item >
              <v-img src="../assets/1b.jpg" width="100%"></v-img>
            </v-carousel-item>
            
            <v-carousel-item >
              <v-img src="../assets/1c.jpg" width="100%"></v-img>
            </v-carousel-item>

            <v-carousel-item >
              <v-img src="../assets/1d.jpg" width="100%"></v-img>
            </v-carousel-item>
        </v-carousel>
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
          @click:append-outer="trackPackage(tracking_number)"
          @keyup.enter="trackPackage(tracking_number)"
          ></v-text-field>
          <v-btn class="my-2" dark color="pink" @click="trackPackage(tracking_number)">Track</v-btn>
          <!-- <h1 class="my-1 font-weight-light">OR</h1>
          <v-btn @click="scannerD = !scannerD" dark color="primary">scan qrcode</v-btn> -->
        </v-card-text>
      </v-card>
    </v-container>

    <!-- <v-container > -->
    <v-container v-if="packag">
        <v-card elevation="1" max-width="768" class="mx-auto">
            <v-expansion-panels v-model="expanded">
                <v-expansion-panel>
                    <v-expansion-panel-header>Package Status - <b>{{ current_status }}</b> - <i>see more</i></v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-timeline dense>
                            <v-timeline-item icon="mdi-check">
                                <h2 class="font-weight-light">PROCESSED</h2>
                                <p><span>{{ packag.processed_date_time }}</span> - Received at {{packag.starting_town}} {{packag.company_name}} Courier Facility and processed for Dispatch</p>
                            </v-timeline-item>

                            <v-timeline-item v-if="packag.transit_status || packag.ready_for_collection_status" :icon="packag.transit_status || packag.ready_for_collection_status?'mdi-map-marker-check': ''" :color="packag.transit_status || packag.ready_for_collection_status? 'primary' : 'grey'" >
                                <h2 class="font-weight-light">IN TRANSIT</h2>
                                <p>{{ packag.transit_departure_time }} - Kindly see the map below for real time package location.</p>
                                <!-- <p>18-06-2022 16:00 - <span>{{ packag.transit_message}}</span></p> -->
                            </v-timeline-item>

                            <v-timeline-item v-if="(packag.transit_message && packag.transit_message != 'In transit.') || packag.ready_for_collection_status" :icon="packag.transit_message || packag.ready_for_collection_status?'mdi-map-marker-check': ''" :color="packag.transit_message || packag.ready_for_collection_status? 'primary' : 'grey'" >
                                <h2 class="font-weight-light">IN TRANSIT</h2>
                                <p>{{ packag.transit_departure_time }} - <span>{{ packag.transit_message}}</span>.</p>
                                <!-- <p>18-06-2022 16:00 - <span>{{ packag.transit_message}}</span></p> -->
                            </v-timeline-item>

                            <v-timeline-item v-if="packag.ready_for_collection_status" :icon="packag.ready_for_collection_status?'mdi-check': ''" :color="packag.ready_for_collection_status? 'primary' : 'grey'">
                                <h2 class="font-weight-light">READY FOR COLLECTION</h2>
                                <p><span>{{ packag.ready_for_collection_date_time}}</span> - Package is ready for collection at {{packag.delivery_town}} Station.</p>
                            </v-timeline-item>
                            <v-timeline-item v-if="packag.collected_status" :icon="packag.collected_status?'mdi-check': ''" :color="packag.collected_status? 'primary' : 'grey'">
                                <h2 class="font-weight-light">COLLECTED</h2>
                                <p><span>{{ packag.collected_date_time }}</span> - Package collected. Thank you for using {{packag.company_name}}</p>
                            </v-timeline-item>
                        </v-timeline>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <MapsView v-if="packag.transit_status || packag.processed_status" :package_coord="current_coordinates" />
        </v-card>
      </v-container>
      <!-- footer ********************************** -->
      <v-card class="py-16 mt-16" flat color="primary">
        <v-container class="my-9 text-center max-width-md">
          <a href="https://buses.all1zed.com" class="white--text green rounded pa-4" style="text-decoration:none">CLICK HERE TO BUY BUS TICKETS</a>
        </v-container>
        <h1 class="text-center white--text">Get it from</h1>
        <v-card-text>
          <v-sheet color="primary" class="mx-auto" max-width="768">
            <v-row>
              <v-col cols="12" md="6" class="text-center">
                <v-btn @click="externalLink('https://play.google.com/store/apps/details?id=com.orem.ali1zed')" class="py-6" dark ><v-img src="../assets/play.png" width="30" class="mr-2"></v-img> Google Play</v-btn>
              </v-col>
              <v-col cols="12" md="6" class="text-center md-text-left">
                <v-btn @click="externalLink('https://apps.apple.com/us/app/all1zed/id1588388550')" class="py-6" dark ><v-img src="../assets/apple.png" width="30" class="mr-2"></v-img> Apple Store</v-btn>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>

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


    <!-- error dialog -->
    <v-dialog v-model="error_dialog" max-width="400">
      <v-card>
        <v-app-bar flat dark color="red">
          <v-card-title>ERROR!</v-card-title>
        </v-app-bar>
        <v-card-text>
          <p>{{ error_msg }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" dark @click="error_dialog = !error_dialog">ok</v-btn>
        </v-card-actions>
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
      error_dialog: false,
      tracking_number: '',
      loading: null,
      error_msg: null,
      packag: null,
      drawer : null,
      token:null,
      expanded : [0],
      dheight: 400,
      current_status: 'Processed',
      current_coordinates: [],
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
              console.log(res.data)
              this.packag = res.data
              this.stringToArr(this.packag.current_coordinates)
              this.loading = false
              // if((this.packag.transit_status || this.packag.processed_status) && (!this.packag.ready_for_collection_status && !this.packag.collected_status)){
              //   this.expanded = []
              // }
              this.setCurrentStatus(this.packag)
            }).catch((err)=>{
              this.error_msg = 'an error occured! : '+err.response.data.message
              if(err.response.status == 404){
                this.error_msg = "We could not find any package with the tracking number you entered! please check the number if it is a valid tracking number"
              }
              this.loading = false
              this.error_dialog = true
            })
          }).catch((err)=>{
            alert(err)
            this.loading = false
          })
        }
      },
      setHeight(){
        this.dheight = this.$refs.slideshow.$el.offsetWidth/2
      },
      externalLink(link){
        document.location = link
      },

      setCurrentStatus(p){
        if(p.collected_status){
          this.current_status = "COLLECTED"
        }else if(p.ready_for_collection_status){
          this.current_status = "READY FOR COLLECTION"
        }else if(p.transit_status){
          this.current_status = "IN TRANSIT"
        }
      },
      stringToArr(str){
        this.current_coordinates['0'] = parseFloat(str.split(",")['0'])
        this.current_coordinates['1'] = parseFloat(str.split(",")['1'])
        console.log(this.current_coordinates)
      }
      
    },
    destroyed() {
      window.removeEventListener("resize", this.setHeight);
    },
    mounted(){
      if(this.$cookies.isKey('package')){
        this.tracking_number = this.$cookies.get('package')
      }
      window.addEventListener("resize", this.setHeight);
      this.setHeight()
    }
}
</script>

<style>
  .cos{
    /* background: url('All1Zed2022!.png'); */

  }

  @media screen and (max-width : 768px) {
    .cos{
      height: 200px;
    }
  }
</style>
