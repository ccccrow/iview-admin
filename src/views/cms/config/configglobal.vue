<template>
  <div>
    <video-player  class="video-player-box"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline="true"
                 customEventName="customstatechangedeventname"
 
                 @play="onPlayerPlay($event)"
                 @pause="onPlayerPause($event)"
                 @ended="onPlayerEnded($event)"
                 @waiting="onPlayerWaiting($event)"
                 @playing="onPlayerPlaying($event)"
                 @loadeddata="onPlayerLoadeddata($event)"
                 @timeupdate="onPlayerTimeupdate($event)"
                 @canplay="onPlayerCanplay($event)"
                 @canplaythrough="onPlayerCanplaythrough($event)"
 
                 @statechanged="playerStateChanged($event)"
                 @ready="playerReadied">
  </video-player>
  </div>
</template>

<script>
require('videojs-flash')
export default {
  data() {
      return {
        playerOptions: {
          // videojs options
          muted: true,
          language: 'zh',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "rtmp/mp4",
            src: "rtmp://184.72.239.149/vod/&mp4:BigBuckBunny_115k.mov"
          }],
          height: 540,
          width:800,
          poster: "/static/images/author.jpg"
        }
      }
    },
    mounted() {
      console.log('this is current player instance object', this.player)
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      // ...player event
 
      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
 
      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      }
    }
}
</script>
