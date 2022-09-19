<script>
    export default {
        name: 'authComp',
        mounted(){
            let token = 'null'
            if(this.$cookies.get('token')['asscess']){
                token = this.$cookies.get('token')['access']
                this.axios.post('https://packages.pridezm.com/auth/jwt/verify', {'token':token}).then((res)=>{
                    console.log('from auth pass ', res)
                }).catch((err)=>{
                    console.log('auth fail! ', err)
                })
            }
        }
    }
</script>