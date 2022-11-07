<template>
  <div>
        <div v-for="n in packagData.number_of_packages" :key="n" class="rct pdf-item text-uppercase" style="border:1px solid #000; font-size: 18pt; border-radius: 5px; background-color: #fff;">
            <div style="border-bottom:1px solid;padding:8px;font-size: 18pt;">
                <h2 class="mb-4 text-center">{{ courier }} Courier</h2>
                
            </div>
            <div style="border-bottom:1px solid;padding:8px;font-size: 18pt;">
                <p><b>RECEIVER INFORMATION</b></p>
                <P>RECEIVER NAME: <b>{{packagData.receiver_name}}</b></P>
                <P>RECEIVER NUMBER: <b>{{packagData.receiver_phone_number}}</b></P>
            </div>
            <div style="border-bottom:1px solid;padding:8px;">
                <P>PACKAGE ROUTE:</P>
                <P style="text-align:center"><b>{{packagData.starting_town}} - {{packagData.delivery_town}}</b></P>
            </div>
            <table width="100%" style="border-bottom:1px solid;padding:8px;">
                <tr>
                    <td width="53%">NUMBER OF PACKAGES</td>
                    <td width="10%" style="border-right:1px solid"><b>{{packagData.number_of_packages}}</b></td>
                    <td width="33%" style="text-align:center"><b>{{n}}/{{packagData.number_of_packages}}</b></td>
                </tr>
            </table>
            <table width="100%" style="border-bottom:1px solid;padding:8px;">
                <tr>
                    <td>CHARGE</td>
                    <td><b>K{{packagData.price}}</b></td>
                </tr>
            </table>
            <div style="border-bottom:1px solid;padding:8px;" >
                <p>SENDER'S PHONE NUMBER</p>
                <p class="text-center"><b>{{packagData.sender_phone_number}}</b></p>
            </div>
            <div class="text-center">
                <p>TRACKING NUMBER</p>
                <P><b>{{packagData.package_tracking_number}}</b></P>
                <br><br>
                <table>
                    <tr>
                    <td width="30%"></td>
                    <td width="30%">
                        <qrcode-vue  :value="packagData.package_tracking_number" :size="200" level="H" />
                    </td>
                    <td width="30%"></td>
                    </tr>
                </table>
                <p>DATE : {{packagData.departure_date}}</p>
            </div>
            <div class="capitalize" style="padding:8px">
                <p class="pa-0 ma-0">buy bus tickets online</p>
                <p class="pa-0 ma-0">buy football tickets online</p>
                <p class="pa-0 ma-0">buy event tickets online</p>
                <p class="pa-0 ma-0">download all1zed app </p>
                
                <p class="text-right pa-0 my-4" style="margin-top:4px">All1zed Package Tracking</p>
            </div>
        </div>
  </div>
</template>

<script>
    import qrcodeVue from 'qrcode.vue';
    export default {
    components:{ qrcodeVue },
    props:{
        packagData: Object, 
        courier:String
    },
    data: ()=>({
        data: {}
    }),
}
</script>

<style>
    
    .rct {
    margin:45px 45px 0 45px !important;
    page-break-after: always;
    page-break-inside: avoid;
}

/* @page{ 
    size: A4;
} */
 
/* @page {
    size: 8cm auto;  
    width: 8cm; 
    height: 100%; 
    margin: 0;
    margin-left: 5px !important;
} */
</style>