<template>
  <div>
    <QrcodeStream @decode="onDecode"/>
  </div>
</template>

<script>
    import { QrcodeStream } from 'vue-qrcode-reader';
export default {
    components:{ QrcodeStream },
    data: ()=>({

    }),
    methods: {
        onDecode (decodedString) {
            console.log(decodedString)
            this.$emit('scanned', decodedString)
        }
    }
}
</script>

<style>

</style>