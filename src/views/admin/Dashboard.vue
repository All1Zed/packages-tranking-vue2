<template>
  <div>
    <NavView bcolor="blue" pagetitle="Dashboard" />
    <v-container>
        <v-card elevation="1">
            <div class="pa-2 orange white--text">
                <v-card-title>Processed Package List</v-card-title>
                
                <v-row no-gutters>
                    <v-col cols="12" md="3" align-self="center">
                        <v-select
                            v-model="processed_by"
                            label="Processed by"
                            dense
                            outlined
                            solo
                            prepend-inner-icon="mdi-bus"
                            :items="usernames"
                            class="mx-1"
                            :loading="loading"
                            hide-details
                            ></v-select>
                    </v-col>
                    <v-col cols="12" md="3" align-self="center">
                        <v-select
                            v-model="selected_vehile"
                            label="Filter By Vehicle"
                            dense
                            outlined
                            solo
                            prepend-inner-icon="mdi-bus"
                            :items="vehicle_name_list"
                            class="mx-1"
                            @change="selectVehicle(selected_vehile)"
                            :loading="loading"
                            hide-details
                            ></v-select>
                    </v-col>
                    <v-col cols="12" md="3" align-self="center">
                        <v-dialog
                            ref="dialog"
                            v-model="modal"
                            :return-value.sync="date"
                            persistent
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="date"
                                label="Filter by date"
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                dense
                                outlined
                                solo
                                hide-details
                                clearable
                                class="mx-1"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="date"
                            scrollable
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="modal = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.dialog.save(date),getPackages()"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>
                    <v-col align-self="center">
                        <v-btn @click="getPackages()" dark color="blue">filter</v-btn>
                    </v-col>
                </v-row>
            </div>
        </v-card>
        <v-card elevation="1" class="scroll-y" max-height="400">
            <!-- <v-data-table 
            :loading="loading"
            loading-text="Loading... please waite"
            dense
            :headers="[{
                text: 'Tracking No.',
                align: 'start',
                sortable: false,
                value: 'package_tracking_number',
            },
            {text: 'Sender Phone', value: 'sender_phone_number'},
            {text: 'Receiver Name', value: 'receiver_name'},
            {text: 'Receiver Phone', value: 'receiver_phone_number'},
            {text: 'Bus', value: 'vehicle_name'},
            {text: 'Origin', value: 'starting_town'},
            {text: 'Destination', value: 'delivery_town'},
            {text: 'Charge', value: 'price'},
            {text: 'Collected', value: 'collected_status'},
            
            ]"

            :items="packags"
            >
            <v-btn>download pdf</v-btn>
            </v-data-table> -->

            <v-simple-table class="dtable" width="100%">
                <thead>
                    <tr>
                        <th class="text-left orange--text">
                            Tracking No.
                        </th>
                        <th class="text-left orange--text">
                            Sender Phone
                        </th>
                        <th class="orange--text">Receiver Name</th>
                        <th class="orange--text">Receiver Phone</th>
                        <th class="orange--text">Processed By</th>
                        <th class="orange--text" style="min-width:150px">Bus</th>
                        <th class="orange--text">Origin</th>
                        <th class="orange--text">Destination</th>
                        <th class="orange--text">Charge</th>
                        <th class="orange--text">Value</th>
                        <th class="orange--text">Status</th>
                        <th class="orange--text">Departure Date</th>
                    </tr>
                </thead>
                <tbody class="grey--text text--darken-2">
                    <td v-if="loading" colspan="12" class="ma-0 pa-0">
                        <v-progress-linear indeterminate color="orange"></v-progress-linear>
                    </td>
                    <tr class="tr" v-for="item in packags" :key="item.package_tracking_number" style="border-top:1px solid">
                        <td style="border-right:1px solid; border-left:1px solid">{{item.package_tracking_number}}</td>
                        <td style="border-right:1px solid">{{item.sender_phone_number}}</td>
                        <td style="border-right:1px solid">{{item.receiver_name}}</td>
                        <td style="border-right:1px solid">{{item.receiver_phone_number}}</td>
                        <td style="border-right:1px solid"> {{ item.processed_by == "Not applicable to this package" || item.processed_by == "Not Applicable for this package" ? 'N/A' : item.processed_by }} </td>
                        <td style="border-right:1px solid">{{ item.vehicle_name}}</td>
                        <td style="border-right:1px solid">{{item.starting_town}}</td>
                        <td style="border-right:1px solid">{{item.delivery_town}}</td>
                        <td style="border-right:1px solid">K{{item.price.toLocaleString('en-US')}}</td>
                        <td style="border-right:1px solid">K{{item.package_value.toLocaleString('en-US')}}</td>
                        <td style="border-right:1px solid">{{item.collected_status? 'Collected': 'Not Collected'}}</td>
                        <td style="border-right:1px solid">{{item.departure_date}}</td>
                    </tr>
                    <tr>
                        <td><b>TOTAL</b></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><b>K{{packag_total.toLocaleString('en-US')}}</b></td>
                        <td></td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card>
        <v-card elevation="1">
            <v-card-text>
                <v-btn @click="generateReport" color="orange" dark :disabled="!packags.length>0">download pdf</v-btn>
            </v-card-text>
        </v-card>
        
        <v-card class="mt-9 scroll-y" elevation="1" max-height="400">
            <v-app-bar dark color="green" dense flat><v-card-title>Per Vehicle Daily Summary</v-card-title></v-app-bar>
            <v-simple-table dense>
                <template v-slot:default>
                <thead>
                    <h1></h1> 
                    <tr>
                        <th class="text-left green--text">
                            Vehicle
                        </th>
                        <th class="text-left green--text">
                            No. of Packages
                        </th>
                        <th class="green--text">Charge</th>
                    </tr>
                </thead>
                <tbody class="grey--text text--darken-2">
                    <td v-if="load_vehicles" colspan="3" class="ma-0 pa-0">
                        <v-progress-linear indeterminate color="orange"></v-progress-linear>
                    </td>
                    <tr v-for="item in vehicles" :key="item.id">
                        <td>{{item['vehicle_name']}}</td>
                        <td>{{item['package_count']}}</td>
                        <td>K{{item['charge'].toLocaleString('en-US') }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <h3 class="px-4 green--text mt-4">Daily Company Total</h3>
                    <tr>
                        <td><b>TOTAL PACKAGES: </b></td>
                        <td><b>{{total_packages.toLocaleString('en-US') }}</b></td>
                    </tr>
                    <tr>
                        <td><b>TOTAL AMOUNT: </b></td>
                        <td><b>K{{ total_amount.toLocaleString('en-US') }}</b></td>
                    </tr>
                </tfoot>
                </template>
            </v-simple-table>
        </v-card>

        <v-card elevation="1">
            <v-card-text>
                <v-btn @click="downloadVechicleTable" color="orange" dark :disabled="!vehicles.length>0">download pdf</v-btn>
            </v-card-text>
        </v-card>
    </v-container>

    <!-- ****************************************** -->
    <!-- <v-dialog v-model="loading" max-width="100" persistent>
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
    </v-dialog> -->

    <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :filename="p_download_filename"
        :pdf-quality="2"
        :manual-pagination="true"
        :paginate-elements-by-height="950"
        pdf-format="a4"
        pdf-orientation="landscape"
        :margin="45"
 
        @progress="onProgress($event)"
        @hasStartedGeneration="hasStartedGeneration()"
        @hasGenerated="hasGenerated($event)"
        ref="html2Pdf"
    >
        <section slot="pdf-content">
            <DownloadsView :packags="packags" :packag_total="packag_total" />
        </section>
    </vue-html2pdf>

    <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="true"
        :preview-modal="false"
        :filename="v_download_filename"
        :pdf-quality="2"
        :manual-pagination="true"
        :paginate-elements-by-height="950"
        pdf-format="a4"
        pdf-orientation="portrait"
        :margin="45"
 
        @progress="onProgress($event)"
        @hasStartedGeneration="hasStartedGeneration()"
        @hasGenerated="hasGenerated($event)"
        ref="vehicle"
    >
        <section slot="pdf-content">
            <DownloadsVehicleTable :vehicles="vehicles" :total_amount="total_amount"  :total_packages="total_packages" />
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
              <strong class="white--text">{{ Math.ceil(dProgress) }}%</strong>
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
import DownloadsView from './DownloadsView.vue';
import DownloadsVehicleTable from './DownloadsVehicleTable.vue';
export default {
    name: 'DashboardView',
    components: { NavView, VueHtml2pdf, DownloadsView, DownloadsVehicleTable },
    data: ()=>({
        loading: false,
        selected_vehile: null,
        vehicles:[],
        vehicle: '',
        selected_user: null,
        users:[],
        usernames:[],
        user: '',
        processed_by: '',
        vehicle_name_list: [],
        packags:[],
        total_packages: 0,
        total_amount: 0,
        load_vehicles: true,
        packag_total: 0,
        filter_opt: '',
        filter_date: ['Today', 'Yesterday', '2 Days ago', '3 Days ago', '4 Days ago', '5 Days ago'],

        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        v_download_filename: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        p_download_filename: 'p'+(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu: false,
        modal: false,

        downloadInd: false,
        dProgress: 0,
        dDone: false,
        downloadMsg: 'Your file is downloading...',
    }),
    methods:{
        // download package table
        generateReport() {
          this.downloadInd = true
          this.printDialog = false
            this.$refs.html2Pdf.generatePdf()
        },
        // download vehicles table
        downloadVechicleTable() {
          this.downloadInd = true
          this.printDialog = false
            this.$refs.vehicle.generatePdf()
        },
        
        onProgress(val){
          this.dProgress = val
          if(val == 100){
            this.dDone = true
            this.downloadMsg = 'Your File download is complete! The file has been save in your download folder.'
          }
        },
        hasStartedGeneration(){},
        hasGenerated(){
          this.dDone = true
          this.downloadMsg = 'Your download is complete! The file has been save in your down load folder with the receiver\'s name.'
        },
        getPackages(){
            this.packag_total = 0;
            this.packags = []
            this.authVerify();
            this.loading = true
            const headers = {
                Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            if(this.date == null){
                this.date = ''
            }
            this.axios.get('https://packages.pridezm.com/api/packages?departure_date='+this.date+'&vehicle='+this.vehicle+'&processed_by='+this.processed_by,{headers}).then((res)=> {
                this.packags = res.data
                res.data.forEach(element => {
                    this.packag_total += element.price
                });
                // console.log(res.data)
                this.loading = false
            }).catch(()=>{
                // alert(e);
                this.loading = false
            })
        },
        getVehicles(){
            this.loading = true
            this.authVerify();
            const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/vehicles', {headers}).then((res) =>{
            if(res.data.length > 0){
                let vehicles = res.data
                
                for (let index = 0; index < vehicles.length; index++) {
                    let package_count;
                    let charge;
                    let vehicle_name = vehicles[index].vehicle_full_name
                    let id = vehicles[index].id

                    this.vehicle_name_list.push(vehicle_name);

                    this.axios.get('https://packages.pridezm.com/api/total-sales?vehicle_id='+vehicles[index].id,{headers}).then((res)=> {
                        charge = res.data
                    }).catch((e)=>{
                        alert(e);
                    }).then(()=>{
                        this.axios.get('https://packages.pridezm.com/api/total-sales-count?vehicle_id='+vehicles[index].id,{headers}).then((res)=> {
                            package_count = res.data
                        }).catch(()=>{
                            // alert(e);
                        }).then(()=>{
                            this.vehicles.push({
                                id:id,
                                vehicle_name: vehicle_name,
                                charge:charge,
                                package_count:package_count
                            })
                        })
                    })
                    if(index == vehicles.length - 1){
                        this.load_vehicles = false
                    }
                }
            }
            this.loading = false
            }).catch(() => {
            this.loading = false
            // this.load_vehicles = false
            })
        },
        getUsers(){
            this.loading = true
            this.authVerify();
            const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/users', {headers}).then(res => {
                if(res.data.length > 0){
                    for (let index = 0; index < res.data.length; index++) {
                        // this.usernames[index] = res.data[index].username  
                        this.usernames.push(res.data[index].username)    
                    }
                    this.users = res.data
                    console.log(res.data)
                    console.log(this.usernames)
                }
            })
        },
        selectVehicle(vehicle){
          this.vehicle = this.vehicles.filter(arr => arr.vehicle_name == vehicle)[0]['id']
        //   console.log(this.vehicle)
        },
        selectUser(user){
          this.user = this.users.filter(arr => arr.username == user)[0]['id']
          console.log(this.user)
        },
        getPackageCount(){
            this.authVerify();
            this.loading = true
            const headers = {
                Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/total-sales-count',{headers}).then((res)=> {
                this.total_packages = parseInt(res.data)
                this.loading = false
            }).catch(()=>{
                // alert(e);
                this.loading = false
            })
        },
        getSales(){
            this.authVerify();
            this.loading = true
            const headers = {
                Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/total-sales',{headers}).then((res)=> {
                this.total_amount = parseInt(res.data)
                this.loading = false
            }).catch(()=>{
                // alert(e);
                this.loading = false
            })
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
    },
    mounted(){
        this.getUsers()
        this.getVehicles()
        this.getPackages()
        this.getPackageCount()
        this.getSales()
    }
}
</script>

<style>
    .scroll-y{
        overflow-y: auto;
    }
</style>