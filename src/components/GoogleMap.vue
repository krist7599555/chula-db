<template lang='pug'>
  div
    div
      div.field
        p.title CURRENT LOCATION
        p.subtitle.has-text-success(v-if='isCheckIn') your are already check in
        p.subtitle.has-text-danger(v-else) your are not check in yet
      
      div(v-if='loading')
        SPINNER
      div(v-else-if='locationStatus == "denied"').
        Permission for geolocation is denined #[br]
        Please enable it manualy in setting
      div(v-else-if='locationStatus != "granted" && !userAllow')
        button.button.is-success(@click='userAllow = true; geolocate()') Allow Permission
      div(v-else)
        table.table.is-narrow: tbody.is-size-5
          tr 
            td lat
            td {{currentPlace.lat}}
          tr
            td lng
            td {{currentPlace.lng}}
          tr 
            td nearest center
            td {{minCenterDistance}} meter
          tr 
            td nearest cycle
            td {{minCycleDistance}} meter
        br
        slot(
          :cenDist='minCenterDistance' 
          :cycDist='minCycleDistance'
        )
        gmap-map(
          :center="center"
          :zoom="17"
          style="width:100%;  height: 600px;"
          :options=`{
            disableDefaultUI: true,
            zoomControl: false,
            scaleControl: true,
          }`
        )
          // pin markers
          gmap-marker(
            :key="index"
            v-for="(m, index) in markers"
            :position="m"
            @click="center=m"
            :clickable="true"
            :draggable="true"
          )
          // client location
          gmap-marker(
            selfPin
            :position="currentPlace"
            :clickable="true"
            :draggable="true"
            :icon="require('@/asset/gmap/me.png')"
            :opacity='.95'
            @dragend='dragend'
            ref='self'
          )
</template>

<script>
import Vue from "vue";
import { setTimeout } from "timers";
import { rejects } from "assert";
import { distance } from "./HaversineFormula";

export default {
  name: "GoogleMap",
  props: {
    markers: {
      type: Array,
      default: () => []
    },
    isCheckIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      center: { lat: 0.0, lng: 0.0 },
      currentPlace: { lat: 0.0, lng: 0.0 },
      loading: true,
      locationStatus: "",
      userAllow: false
    };
  },
  mounted() {
    this.locationSupport = !!navigator.geolocation;
    if (!this.locationSupport) {
      this.locationStatus = "notSupport";
    } else {
      this.geolocate();
    }
  },

  // COMPUTED
  computed: {
    cycleDistance() {
      return _.map(this.markers, coor => {
        return distance(coor, this.currentPlace) - coor.area;
      });
    },
    centerDistance() {
      return _.map(this.markers, coor => {
        return distance(coor, this.currentPlace);
      });
    },
    minCenterDistance() {
      return _.min(this.centerDistance);
    },
    minCycleDistance() {
      return _.max([0, _.min(this.cycleDistance)]);
    }
  },

  // METHODS
  methods: {
    dragend(a) {
      let lat = a.latLng.lat();
      let lng = a.latLng.lng();
      this.currentPlace = { lat, lng };
    },
    setPlace(place) {
      this.currentPlace = place;
      console.log(this.currentPlace);
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.center = marker;
        this.currentPlace = null;
      }
    },
    async geolocate() {
      this.loading = true;
      let result = await navigator.permissions.query({ name: "geolocation" });
      this.locationStatus = result.state;
      if (
        result.state === "granted" ||
        (result.state === "prompt" && this.userAllow)
      ) {
        navigator.geolocation.watchPosition(
          position => {
            this.loading = false;
            this.currentPlace = this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          },
          fail => console.log("geo location is blocked"),
          {
            enableHighAccuracy: true
          }
        );
      } else {
        console.log("permission is denied");
      }
      this.loading = false;
    }
  }
};
</script>

// <style lang="stylus" scpoed>
                     
     
       
               
                                
                                                                               
                                                                    
      
                         
               
                                                  
                                                   
                                           
                                                                
                                                                                         
                 
                                              
             
                  
                                   
            
                  
                                   
             
                             
                                          
             
                            
                                         
          
             
                                       
                                     
         
                 
                          
                    
                                             
                     
                                   
                               
                               
            
         
                        
                      
                        
                                         
                         
                             
                             
                             
           
                            
                      
                   
                                    
                             
                             
                                                  
                          
                              
                      
           
           

        
                      
                                    
                                 
                                              

                
                    
          
              
                  
                       
      
                
                    
                    
     
    
          
            
                                     
                                           
                    
                         
                      
      
    
             
                                                   
                                 
                                        
            
                       
     
    
             
                     
                                          
                                                             
         
      
                      
                                          
                                                 
         
      
                         
                                        
      
                        
                                                   
     
    
            
                
                               
                               
                                       
      
                     
                                
                                     
      
                 
                              
                        
                                                         
                                                        
          
                                                
                             
                                 
       
      
                       
                         
                                                                          
                                        
                                     
                                                         
                                                         
                               
                                             
                                          
                                          
            
                                                          
         
                                  
           
              
                                           
       
                          
     
   
  
         

                               
// .table td {
//   border: none !important;
// }
// </style>
