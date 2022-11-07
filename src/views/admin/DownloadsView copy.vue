<template>
  <div>
    <NavView bcolor="blue" pagetitle="Dashboard" />
    <v-container>
        <v-card elevation="1" class="scroll-y mt-9" max-height="400">
            <v-app-bar dark flat color="orange" dense>
                <v-card-title>Processed Package List</v-card-title>
            </v-app-bar>
            <v-simple-table dense>
                <template v-slot:default>
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
                        <th class="orange--text">Bus</th>
                        <th class="orange--text">Origin</th>
                        <th class="orange--text">Destination</th>
                        <th class="orange--text">Charge</th>
                        <th class="orange--text">Status</th>
                    </tr>
                </thead>
                <tbody class="grey--text text--darken-2">
                    <tr v-for="item in packags" :key="item.package_tracking_number">
                        <td>{{item.package_tracking_number}}</td>
                        <td>{{item.sender_phone_number}}</td>
                        <td>{{item.receiver_name}}</td>
                        <td>{{item.receiver_phone_number}}</td>
                        <td>{{item.starting_town}}</td>
                        <td>{{item.delivery_town}}</td>
                        <td>K{{item.price}}</td>
                        <td>{{item.collected_status? 'Collected': 'Not Collected'}}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
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
                        <td>K{{item['charge']}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <h3 class="px-4 green--text mt-4">Daily Company Total</h3>
                    <tr>
                        <td><b>TOTAL PACKAGES: </b></td>
                        <td><b>{{total_packages}}</b></td>
                    </tr>
                    <tr>
                        <td><b>TOTAL AMOUNT: </b></td>
                        <td><b>K{{ total_amount}}</b></td>
                    </tr>
                </tfoot>
                </template>
            </v-simple-table>
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
  </div>
</template>

<script>
import NavView from '@/components/NavView.vue';
export default {
    name: 'DashboardView',
    components: { NavView },
    data: ()=>({
        loading: false,
        vehicles:[],
        packags:{},
        total_packages:0,
        total_amount:0,
        load_vehicles: true,
    }),
    methods:{
        getPackages(){
            this.authVerify();
            this.loading = true
            const headers = {
                Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/packages',{headers}).then((res)=> {
                this.packags = res.data
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
                    this.axios.get('https://packages.pridezm.com/api/total-sales?vehicle_id='+vehicles[index].id,{headers}).then((res)=> {
                        charge = res.data
                    }).catch((e)=>{
                        alert(e);
                    }).then(()=>{
                        this.axios.get('https://packages.pridezm.com/api/total-sales-count?vehicle_id='+vehicles[index].id,{headers}).then((res)=> {
                            package_count = res.data
                            // console.log(res)
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
        getPackageCount(){
            this.authVerify();
            this.loading = true
            const headers = {
                Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/total-sales-count',{headers}).then((res)=> {
                this.total_packages = res.data
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
                this.total_amount = res.data
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