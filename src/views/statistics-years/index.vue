<template>
</template>
<script>
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import Stomp from 'stompjs'
export default {
  data: function () {
    return {
      stompClient: null,
      sockjs: null,
      username: 123456
    }
  },
  mounted () {
    // this.initWebSocket()
  },
  beforeDestroy () {
    // 页面离开时断开连接
    this.disconnect()
  },
  methods: {
    initWebSocket: function () {
      // 建立连接对象
      this.socket = new SockJS("http://localhost:1112/api")
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.debug = false
      this.stompClient.reconnect_delay = 5000
      // 建立连接
      this.stompClient.connect({}, (frame) => {
        // 订阅主题
        this.stompClient.subscribe('/topic/all', res => {
          console.info('订阅主题: ', res)
          this.$message({
            message: res.body,
            type: 'success',
            duration: 3000
          })
        })
        // 订阅点对点消息 username=111111(对应后端代码 simpMessagingTemplate.convertAndSendToUser("111111","/cmdFinish","今天10点开项目启动会-linxin");)
        this.stompClient.subscribe(`/queue/${this.username}/cmdFinish`, res => {
          console.info('订阅点对点消息: ', res)

          this.$message({
            message: res.body,
            type: 'success',
            duration: 3000
          })
        })
      }, error => {
        console.log("连接失败：", error)
      })
    },
    disconnect: function () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
    }
  }
};
</script>
