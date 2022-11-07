<template>
  <div>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" 
            data-projection="EPSG:4326" style="height: 400px">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-feature v-if="package_coord" id="position-feature">
        <vl-geom-point :coordinates="package_coord"></vl-geom-point>
        <!-- <vl-geom-point :coordinates="package_coord"></vl-geom-point> -->
        <vl-style-box>
          <vl-style-icon src="../assets/package_map.png" :scale="0.09" :anchor="[0.5, 1]"></vl-style-icon>
        </vl-style-box>
      </vl-feature>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <!-- <div style="padding: 20px">
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ geolocPosition }}
    </div> -->
  </div>
</template>

<script>

  export default {
    props:['package_coord'],
    data () {
      return { 
        zoom: 10,
        center: [0,0],
        rotation: 0,
        geolocPosition: undefined,
        lat: 0,
        long: 0,
      }
    },
    methods:{
      getCoordinats(latlng){
        this.center = latlng
        this.zoom = 14
      },
      
    },
    mounted(){
      this.center = this.package_coord
    },
  }
</script>