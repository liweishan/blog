<template>
  <canvas id="c" />
</template>

<style lang="less" scoped>
#c {
  width: 100%;
  height: 100%;
}
</style>

<script>
export default {
  name: 'Canvas',
  data() {
    return {
      ctx: null,
      w: 0,
      h: 0,
      hue: 217,
      stars: [],
      maxStars: 1400,
      canvas2: null,
      stop: null
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    cancelAnimationFrame(this.stop)
    this.stars = []
    this.ctx = null
    this.canvas2 = null
  },
  methods: {
    /**
     * 初始化页面
     */
    init() {
      const { hue, maxStars } = this
      const canvas = document.getElementById('c')
      this.ctx = canvas.getContext('2d')
      this.h = canvas.clientHeight
      canvas.height = this.h
      this.w = Math.max(canvas.clientWidth, this.h * 2)
      canvas.width = this.w
      this.canvas2 = document.createElement('canvas')
      const ctx2 = this.canvas2.getContext('2d')
      this.canvas2.width = 100
      this.canvas2.height = 100
      const half = +this.canvas2.width / 2
      const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
      gradient2.addColorStop(0.025, '#fff')
      gradient2.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`)
      gradient2.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`)
      gradient2.addColorStop(1, 'transparent')

      ctx2.fillStyle = gradient2
      ctx2.beginPath()
      ctx2.arc(half, half, half, 0, Math.PI * 2)
      ctx2.fill()

      let i = 0
      // 生成数据
      while (i < maxStars) {
        this.star(i)
        i += 1
      }

      this.animation()
    },
    /**
     * 随机数
     * @param {Number} min 最小值
     * @param {Number} max 最大值
     */
    random(min, max) {
      if (!max) {
        max = min
        min = 0
      }

      if (min > max) {
        const hold = max
        max = min
        min = hold
      }

      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    /**
     * 计算渲染数据
     */
    star(idx) {
      const {
        stars,
        maxStars,
        w,
        h
      } = this
      const obj = {}
      obj.orbitRadius = this.random(w / 2 - 50)
      obj.radius = this.random(100, obj.orbitRadius) / 10
      obj.orbitX = w / 2
      obj.orbitY = h / 2
      obj.timePassed = this.random(0, maxStars)
      obj.speed = this.random(obj.orbitRadius) / 900000
      obj.alpha = this.random(2, 10) / 10

      stars[idx] = obj
    },
    /**
     * 改变数据的值才能让canvas动起来，并渲染canvas
     * @param {Object} obj 渲染的数据
     */
    draw(obj) {
      const { canvas2, ctx } = this
      const x = Math.sin(obj.timePassed + 1) * obj.orbitRadius + obj.orbitX
      const y = Math.cos(obj.timePassed) * (+obj.orbitRadius / 2) + obj.orbitY
      const twinkle = this.random(10)

      if (twinkle === 1 && obj.alpha > 0) {
        obj.alpha -= 0.05
      } else if (twinkle === 2 && obj.alpha < 1) {
        obj.alpha += 0.05
      }

      ctx.globalAlpha = obj.alpha
      ctx.drawImage(canvas2, x - obj.radius / 2, y - obj.radius / 2, obj.radius, obj.radius)
      obj.timePassed += obj.speed
    },
    /**
     * canvas动画效果
     */
    animation() {
      const {
        stars, hue, w, h, ctx
      } = this
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.8
      ctx.fillStyle = `hsla(${hue}, 64%, 6%, 1)`
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'

      for (const v of stars.values()) {
        this.draw(v)
      }
      // requestAnimationFrame方法相当于一个递归，动画完成后可以继续执行该方法
      this.stop = requestAnimationFrame(this.animation)
    }
  }
}
</script>
