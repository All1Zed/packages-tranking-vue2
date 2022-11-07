<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            app
            dark
            :color="bcolor"
            
        >
            <v-list dense class="white--text">
              <v-list-item link to="/">
                <v-list-item-icon>
                  <v-icon :color="bcolor=='yellow'?'blue':'white'">mdi-view-dashboard</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="bcolor=='yellow'?'blue--text':'white--text'">Home</v-list-item-title>
              </v-list-item>
              <v-list-item link to="/dashboard">
                <v-list-item-icon>
                  <v-icon :color="bcolor=='yellow'?'blue':'white'">mdi-view-dashboard</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="bcolor=='yellow'?'blue--text':'white--text'">Dashboard</v-list-item-title>
              </v-list-item>

              <v-list-item link to="/operator">
                <v-list-item-icon>
                  <v-icon :color="bcolor=='yellow'?'blue':'white'">mdi-view-dashboard</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="bcolor=='yellow'?'blue--text':'white--text'">Operator</v-list-item-title>
              </v-list-item>

              <v-list-item link to="/topups">
                <v-list-item-icon>
                  <v-icon :color="bcolor=='yellow'?'blue':'white'">mdi-currency-usd</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="bcolor=='yellow'?'blue--text':'white--text'">Topup</v-list-item-title>
              </v-list-item>
            </v-list>
        </v-navigation-drawer>
    
        <v-app-bar app :color="bcolor" dark>
            <v-row>
              <v-col class="text-left">
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                <!-- logo -->
                <span :class="bcolor=='yellow'?'blue--text':'white--text'"><b>{{pagetitle}}</b></span>
              </v-col>
              <!-- <v-spacer></v-spacer> -->
              <v-col align-self="center" class="text-right">
                <span  class="mr-2">{{courier.packages_remaining}} Pacs</span>
                <router-link v-if="!isLogedin" to="/login" :class="bcolor=='yellow'?'blue--text':'white--text'">Login</router-link>
                <v-btn text @click="logout" :class="bcolor=='yellow'?'blue--text':'white--text'">Log out</v-btn>
              </v-col>
            </v-row>
        </v-app-bar>
    </div>
  </template>
  
  <script>
    export default {
      props: {bcolor:String, pagetitle:String},
      data: () => ({ 
        drawer: null,
        isLogedin: null,
        courier: {},
      }),
      methods:{
        
        authVerify(){
          let token = 'null'
          if(this.$cookies.isKey('access_token')){
              token = this.$cookies.get('access_token')
              this.axios.post('https://packages.pridezm.com/auth/jwt/verify', {'token':token}).then(()=>{
                this.isLogedin = true
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
                  this.isLogedin = true
              }).catch(()=>{
                  this.$router.push('login')
              })
            }else{
              this.$router.push('login')
            }
        },
        cuorierName(){
            const headers = {
            Authorization: 'JWT '+this.$cookies.get('access_token'),
          }
          this.axios.get('https://packages.pridezm.com/api/courier-companies', {headers}).then((res) =>{
            if (res.status == 200) {
              // console.log(res.data[0])
              this.$cookies.set('courier', res.data[0], '30d')
            }
            this.loading =false
          }).catch(()=>{
            this.loading = false
          })
          
        },
        logout(){
          this.$cookies.remove('refresh_token')
          this.$cookies.remove('access_token')
          this.$router.push('/login')
        }
      },
      mounted(){
        this.cuorierName()
      },
      created(){
        if(this.$cookies.isKey('courier')){
          this.courier = this.$cookies.get('courier')
        }
        this.authVerify()
      }
    }
  </script>