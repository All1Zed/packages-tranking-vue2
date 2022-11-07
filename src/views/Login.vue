<template>
  <div class="loginbg">
    <div class="filter">
        <v-row>
            <v-col align-self="center">
                <v-card max-width="500" class="mx-auto mt-10">
                    <v-app-bar dense dark color="primary" flat> Log in</v-app-bar>
                    <v-card-text>
                        <v-form ref="form1">
                            <p class="red--text">{{ error_msg }}</p>
                            <v-text-field
                            v-model="username"
                            label="User Name"
                            outlined
                            dense
                            :rules="[v => !!v || 'Please enter user name!']"
                            ></v-text-field>

                            <v-text-field
                            v-model="password"
                            label="Password"
                            type="password"
                            outlined
                            dense
                            :rules="[v => !!v || 'Please enter password!']"
                            @keyup.enter="login"
                            ></v-text-field>
                            <v-btn dark color="primary" @click="login">login</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
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
export default {
    name:'LoginView',
    data: () => ({
        username: null,
        password: null,
        error_msg: null,
        loading: true,
    }),
    methods:{
        login(){

            if(this.$refs.form1.validate()){
                this.loading = true
                this.axios.post('https://packages.pridezm.com/auth/jwt/create', {username:this.username, password: this.password}).then((res)=>{
                    this.$cookies.set("access_token", res.data.access, '1d')
                    this.$cookies.set("refresh_token", res.data.refresh, '1d')
                    this.$router.push('/operator')
                    this.loading = false
                }).catch((err) =>{
                    if(err.response.data)this.error_msg = err.response.data.detail;
                    this.loading = false
                })
            }
        },
      refreshAuth(){
        let token = 'null'
        if(this.$cookies.isKey('refresh_token')){
          token = this.$cookies.get('refresh_token')
          this.axios.post('https://packages.pridezm.com/auth/jwt/refresh', {'refresh':token}).then((res)=>{
              this.$cookies.set('access_token', res.data.access, '1d')
              this.$router.push('/operator')
          }).catch(()=>{
            this.loading = false
          })
        }else{
          this.loading = false
        }
      }
    },
    created(){
        if (this.$cookies.isKey('courier')) {
            this.$cookies.remove('courier')
        }
        this.refreshAuth()
    }
}
</script>

<style>
    .loginbg{
        background-image: url('../assets/loginbg.jpg');
        background-size: cover;
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
    }

    .loginbg .filter{
        background-color: rgba(38, 2, 60, 0.682);
        height: 100%;
    }
</style>