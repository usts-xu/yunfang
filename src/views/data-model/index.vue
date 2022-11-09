<template>
  <!--悬浮小广告样式的提示信息-->
  <div id="thediv" ref="thediv" style="background:red;position: absolute; z-index: 111; left: 0; top: 0" v-show="theDivShow"
       @mouseover="clearFdAd" @mouseout="starFdAd">
      <div style="position: absolute;cursor: pointer;font-size: 12px;color: #999999;" @click="theDivShow = false">
          关闭
      </div>
      <a href="javascript:;">
        
          <img src="http://scpic.chinaz.net/files/pic/pic9/202102/apic30992.jpg" width="100%" border="0"/>
          <h3>通知：由于服务器更新，请于今晚12点前下线！</h3>
      </a>
  </div>
</template>

<script>
var interval;
export default {
  data() {
      return {
          xPos: 0,
          yPos: 0,
          xin: true,
          yin: true,
          step: 1,
          delay: 18,
          height: 0,
          Hoffset: 0,
          Woffset: 0,
          yon: 0,
          xon: 0,
          pause: true,
          theDivShow: true,
      };
  },

  mounted() {
      interval = setInterval(this.changePos, this.delay);
  },

  methods: {
      changePos() {
          let width = document.documentElement.clientWidth;
          let height = document.documentElement.clientHeight;
          this.Hoffset = this.$refs.thediv.offsetHeight; //获取元素高度
          this.Woffset = this.$refs.thediv.offsetWidth;

          // 滚动部分跟随屏幕滚动
          // this.$refs.thediv.style.left = (this.xPos + document.body.scrollLeft + document.documentElement.scrollLeft) + "px";
          // this.$refs.thediv.style.top = (this.yPos + document.body.scrollTop + document.documentElement.scrollTop) + "px";

          // 滚动部分不随屏幕滚动
          this.$refs.thediv.style.left =
              this.xPos + document.body.scrollLeft + "px";
          this.$refs.thediv.style.top = this.yPos + document.body.scrollTop + "px";

          if (this.yon) {
              this.yPos = this.yPos + this.step;
          } else {
              this.yPos = this.yPos - this.step;
          }
          if (this.yPos < 0) {
              this.yon = 1;
              this.yPos = 0;
          }
          if (this.yPos >= height - this.Hoffset) {
              this.yon = 0;
              this.yPos = height - this.Hoffset;
          }

          if (this.xon) {
              this.xPos = this.xPos + this.step;
          } else {
              this.xPos = this.xPos - this.step;
          }
          if (this.xPos < 0) {
              this.xon = 1;
              this.xPos = 0;
          }
          if (this.xPos >= width - this.Woffset) {
              this.xon = 0;
              this.xPos = width - this.Woffset;
          }
      },
      clearFdAd() {
          clearInterval(interval);
      },
      starFdAd() {
          interval = setInterval(this.changePos, this.delay);
      },
  },
};
</script>

<style lang="scss" scoped>
#thediv {
  z-index: 100;
  position: absolute;
  top: 43px;
  left: 2px;
  height: 120px;
  width: 200px;
  //overflow: hidden;

  img {
      width: 100%;
      height: 100%;
  }
}
</style>

