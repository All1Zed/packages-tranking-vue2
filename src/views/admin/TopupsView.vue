<template>
  <div>
    <NavView bcolor="blue" pagetitle="TOPUP" />
    <v-container class="mt-9">
        <v-card max-width="300">
            <v-card-text>
                <v-form ref="pform">
                    <v-text-field
                    v-model="plan_phone"
                    label="Enter Phone No."
                    outlined
                    dense
                    :rules="[v => !!v || 'Please enter your mobile number!']"
                    ></v-text-field>

                    <v-autocomplete
                    v-model="plan_choice"
                    label="Plans"
                    outlined
                    dense
                    :items="plans"
                    :rules="[v => !!v || 'Please select package plan!']"
                    :loading="load_plans"
                    @change="selectPlan(plan_choice)"
                    ></v-autocomplete>

                    <v-btn color="blue" dark @click="processPay">Proceed</v-btn>
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
export default {
    name: 'DashboardView',
    components: { NavView },
    data: ()=>({
        loading: false,

        feed_dialog: false,
        feed_title: '',
        feed_message: '',
        err:null,

        plan_phone: null,
        plan_choice:null,

        plans:[],
        plan_list:[],
        total_packages:0,
        total_amount:0,
        load_plans: true,
        plan_id: null,
    }),
    methods:{
        getPlans(){
            this.authVerify();
            this.load_plans = true
            const headers = {
                Authorization: 'JWT '+this.$cookies.get('access_token'),
            }
            this.axios.get('https://packages.pridezm.com/api/pricing-plans',{headers}).then((res)=> {
                this.plan_list = res.data
                res.data.forEach(plan => {
                    this.plans.push(plan.number_of_packages+' Pacs => K'+plan.price)
                });
                this.load_plans = false
            }).catch((err)=>{
                this.feed_title = 'ERROR'
                this.feed_message = "An error occured! Please try again. "+err.response.data.detail
                this.err = true
                this.feed_dialog =true
                this.load_plans = false
            })
        },
        selectPlan(choice){
            console.log(this.plan_choice)
            this.plan_id = this.plan_list.filter( plan => plan.number_of_packages+' Pacs => K'+plan.price == choice)[0].id
            console.log(this.plan_id)
        },

        processPay(){
            if(this.$refs.pform.validate()){
                this.authVerify();
                this.loading = true
                const headers = {
                    Authorization: 'JWT '+this.$cookies.get('access_token'),
                }
                this.axios.post('https://packages.pridezm.com/api/pay',{phone_number:this.plan_phone, plan_id:this.plan_id},{headers}).then((res)=> {
                    console.log(res.data)
                    this.feed_title = 'CONFIRM'
                    this.feed_message = "Please confirm your mobile money PIN on your cellphone to complete the transaction."
                    this.err = false
                    this.feed_dialog =true
                    // this.loading = false
                }).catch((err)=>{
                    this.feed_title = 'ERROR'
                    this.feed_message = "An error occured! Please try again. "+err.response.data.detail
                    this.err = true
                    this.feed_dialog =true
                    this.loading = false
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
    },
    mounted(){
        this.getPlans()
    }
}
</script>

<style>
    .scroll-y{
        overflow-y: auto;
    }
</style>