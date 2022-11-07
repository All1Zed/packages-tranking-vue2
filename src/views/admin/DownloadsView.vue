<template>
  <div style="padding:16px; width: 100%;">
    <table class="dtable" width="100%" style="font-size:small; width:100%">
        <thead style="width:100%">
            <tr style="width:100%">
                <th class="text-left orange--text">
                    Tracking No.
                </th>
                <th class="text-left orange--text">
                    Sender Phone
                </th>
                <th class="orange--text">Receiver Name</th>
                <th class="orange--text">Receiver Phone</th>
                <th class="orange--text">Processed By</th>
                <th class="orange--text" style="min-width:150px">Bus</th>
                <th class="orange--text">Origin</th>
                <th class="orange--text">Destination</th>
                <th class="orange--text">Charge</th>
                <th class="orange--text">Value</th>
                <th class="orange--text">Status</th>
                <th class="orange--text">Departure Date</th>
            </tr>
        </thead>
        <tbody class="grey--text text--darken-2">
            <tr class="tr" v-for="item in packags" :key="item.package_tracking_number" style="border-top:1px solid">
                <td style="border-right:1px solid; border-left:1px solid">{{item.package_tracking_number}}</td>
                <td style="border-right:1px solid">{{item.sender_phone_number}}</td>
                <td style="border-right:1px solid">{{item.receiver_name}}</td>
                <td style="border-right:1px solid">{{item.receiver_phone_number}}</td>
                <td style="border-right:1px solid"> {{ item.processed_by == "Not applicable to this package" || item.processed_by == "Not Applicable for this package" ? 'N/A' : item.processed_by }} </td>
                <td style="border-right:1px solid">{{ item.vehicle_name}}</td>
                <td style="border-right:1px solid">{{item.starting_town}}</td>
                <td style="border-right:1px solid">{{item.delivery_town}}</td>
                <td style="border-right:1px solid">K{{item.price.toLocaleString('en-US')}}</td>
                <td style="border-right:1px solid">K{{item.package_value.toLocaleString('en-US')}}</td>
                <td style="border-right:1px solid">{{item.collected_status? 'Collected': 'Not Collected'}}</td>
                <td style="border-right:1px solid">{{item.departure_date}}</td>
                <div class="di"></div>
            </tr>
            <tr style="border-top:1px solid; border-bottom:1px solid; background-color: #ddd;">
                <td><b>TOTAL</b></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>K{{packag_total.toLocaleString('en-US')}}</b></td>
                <td></td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
    name: "downloadView",
    props:{
        packags:Array,
        packag_total:Number
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

@page {
    margin: 24px auto;
    width: 100%;
}
</style>