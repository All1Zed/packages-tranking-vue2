<template>
  <div style="padding:24px">
    <h1 style="margin-bottom:12px">Per Vehicle Daily Summary</h1>
        <table width="100%">
            <thead>
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
                <tr v-for="item in vehicles" :key="item.id"  style="border-top:1px solid">
                    <td style="border-right:1px solid; border-left:1px solid">{{item['vehicle_name']}}</td>
                    <td style="border-right:1px solid">{{item['package_count']}}</td>
                    <td style="border-right:1px solid">K {{item['charge'].toLocaleString('en-US') }}</td>
                </tr>
            </tbody>
            <tfoot style="border:1px solid">
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
        </table>
  </div>
</template>

<script>
export default {
    name: "DownloadsVehicleTable",
    props:{
        vehicles:Array,
        total_amount:Number,
        total_packages:Number
    },
    data: () => ({
        rows: 1,
    }),
    
}
</script>

<style>
.trr {
    margin:45px 45px 0 45px !important;
    page-break-after: always;
    page-break-inside: avoid;
}

td{
    padding: 1px;
}

.dtable{
    width: 100% !important;
    margin: 24px 12px !important;
}
</style>