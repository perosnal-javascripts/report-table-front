<script>
// 第三方登录获取token，并通知登录页进行接下来的操作
import { getToken, getSession } from '@/apis/index'

export default {
  data: function () {
    return {
      a: ""
    }
  },
  mounted () {
    this.code = this.$route.query.code
    this.state = this.$route.query.state

    console.log('进入callback: ', this.$route)

    if (this.code) {
      this.authorizeLogin()
    }

    if (this.state === "ssoSuccess") {
      this.ssoLogin()
    }

    if (this.state === "ssoFail") {
      window.close()
      this.$sendMessage("取消登录", window.location.origin, 'reject')
    }
  },
  // 手动调用render函数，不渲染任何元素
  render: function (h) {
    return (null)
  },
  methods: {
    toOther () {
      console.log('router: ', this.$route)
    },
    /**
     * 第三方授权登录
     */
    authorizeLogin: function () {
      const params = {
        code: this.code
      }
      getToken(params).then((res) => {
        window.close()
        console.log('res: ', res)
        this.$sendMessage(res, window.location.origin)
      })
    },
    ssoLogin () {
      getSession().then((res) => {
        console.log('获取session: ', res)
        window.close()
        this.$sendMessage(res, window.location.origin)
      })
    }
  }
}
</script>
