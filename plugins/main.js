import Vue from 'vue'
import loadImage from 'blueimp-load-image'
import GuardButton from '@/components/GuardButton'
import UserImage from '@/components/UserImage'

Vue.component(GuardButton.name, GuardButton)
Vue.component(UserImage.name, UserImage)

let isLoadedInstgrm = false
Vue.use({
  install: (Vue, options) => {
    Vue.mixin({
      computed: {
        loggedIn() {
          return !!this.$store.state.accessToken
        },
        user() {
          return this.$store.state.user
        },
        isMobile() {
          return process.browser ? 768 >= window.innerWidth : false
        }
      },
      async mounted() {
        if (!isLoadedInstgrm) {
          const s = document.createElement('script')
          s.setAttribute('src', 'https://www.instagram.com/embed.js')
          document.body.appendChild(s)
          await new Promise(resolve => {
            s.onload = () => resolve(window.twttr)
            isLoadedInstgrm = true
          })
        }
      },
      methods: {
        fromNow(datetime, format = 'YYYY/MM/DD', e) {
          const dt = this.$moment(datetime)
          if (3 >= this.$moment().diff(dt, 'days')) {
            return dt.fromNow()
          } else {
            return dt.format(format)
          }
        },
        // dataURLtoBlob: process.browser ? require('blueimp-canvas-to-blob') : {},
        createDataUrl(e, callback) {
          const MAX_WIDTH = 1080
          const MAX_SIZE = 60000
          const files = e.target.files || e.dataTransfer.files
          if (!files.length) return

          const file = files[0]
          loadImage.parseMetaData(file, data => {
            const options = {
              orientation: null,
              canvas: true
            }
            if (data.exif) {
              options.orientation = data.exif.get('Orientation')
            }
            loadImage(file, canvas => {
              let dataUrl = ''
              if (MAX_WIDTH < canvas.width) {
                const scaleRatio = canvas.height / canvas.width
                const oc = document.createElement('canvas')
                const octx = oc.getContext('2d')
                oc.width = MAX_WIDTH
                oc.height = MAX_WIDTH * scaleRatio
                octx.drawImage(canvas, 0, 0, oc.width, oc.height)
                const sizeRatio = Math.min(0.9, MAX_SIZE / (file.size * ((MAX_WIDTH / canvas.width) ** 2)) + 0.2)
                dataUrl = oc.toDataURL(file.type, sizeRatio)
              } else {
                const sizeRatio = Math.min(0.92, MAX_SIZE / file.size + 0.2)
                dataUrl = canvas.toDataURL(file.type, sizeRatio)
              }

              callback(dataUrl, file.name)
            }, options)
          })
        },
        reloadInstgrm() {
          if (window.instgrm) {
            window.instgrm.Embeds.process()
          }
        }
      }
    })
  }
})
