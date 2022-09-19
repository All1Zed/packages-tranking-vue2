<template>
  <div>
    <v-row>
        <v-col>
            {{courier.company_name}}
        </v-col>
        <v-col>
            <Places
            v-model="country.label"
            placeholder="CURRENT STATION"
            @change="val => { setOrigin(val) }"
            :options="{countries:['zm']}"
            />
        </v-col>
    </v-row>
  </div>
</template>

<script>
import Places from 'vue-places'
export default {
    name:'OriginView',
    components:{ Places },
    data:()=> ({
        // places
      country: {
          label: null,
          data: {},
        },
        courier: {},
    }),
    methods:{
        setOrigin(org){
            if (org) {
                let origin = {
                    name: org.name,
                    latlng: org.latlng
                }
                this.$cookies.set('origin', origin, '30d')
                this.$emit('updat', origin)
            }
        }
    },
    mounted(){
        if(this.$cookies.isKey('origin')){
            this.country.label = this.$cookies.get('origin').name
            this.$emit('updat', this.$cookies.get('origin'))
        }
    },
    created(){
        if(this.$cookies.isKey('courier')){
            this.courier = this.$cookies.get('courier')
        }
    }
}
</script>

<style>

</style>