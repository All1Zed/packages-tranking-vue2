<template>
  <div>
    <NavView bcolor="primary" pagetitle="Operator" />
    <v-container class="mt-9">
      <Origin @updat="vall => setOrigin(vall)" />

        <v-row class="mt-9">
            <v-col cols="6" md="3">
                <v-card color="primary" dark to="/processing">
                    <v-card-text class="text-center py-9 white--text">
                        Sending
                    </v-card-text>
                </v-card>
            </v-col>
            
            <v-col cols="6" md="3">
                <v-card color="pink" class="lighten-2" to="/sorting">
                    <v-card-text class="text-center py-9 white--text">
                        Sorting
                    </v-card-text>
                </v-card>
            </v-col>
            
            <v-col cols="6" md="3">
                <v-card color="green" dark to="/collection">
                    <v-card-text class="text-center py-9 white--text">
                        Collection
                    </v-card-text>
                </v-card>
            </v-col>
            
            <v-col cols="6" md="3">
                <v-card color="orange" dark to="/transit">
                    <v-card-text class="text-center py-9 white--text">
                        Transit
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

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
  </div>
</template>

<script>
import NavView from '@/components/NavView.vue';
import Origin from '@/components/Origin.vue';
export default {
    name: 'OperatorView',
    components: { NavView, Origin, },
    data: ()=>({
      origin_input_dialog: false,
    }),
    methods:{
        cuorierName(){
            const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
          }
          this.axios.get('https://packages.pridezm.com/api/courier-companies', {headers}).then((res) =>{
            if (res.status == 200) {
              this.$cookies.set('courier', res.data[0], '30d')
            }
            this.loading =false
          }).catch(()=>{
            this.loading = false
          })
          
        },
        setOrigin(origin){
        if (origin) {
            this.starting_town = origin.name
            this.origin_input_dialog = false
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
    },
    mounted(){
      if(!this.$cookies.isKey('origin')){
        this.origin_input_dialog = true
      }
    },
    created(){
        if(!this.$cookies.isKey('courier')){
            this.cuorierName()
        }
    }
}
</script>

<style>

</style>