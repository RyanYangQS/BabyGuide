<template>
  <view class="chart-wrapper">
    <view class="chart-container">
      <canvas 
        canvas-id="temperatureChart"
        id="temperatureChart"
        class="chart-canvas"
        type="2d"
      ></canvas>
    </view>
    
    <!-- 图例 -->
    <view class="chart-legend">
      <view class="legend-item">
        <view class="legend-dot normal"></view>
        <text class="legend-text">正常 (≤37.3°C)</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot low-fever"></view>
        <text class="legend-text">低热 (37.3-38.5°C)</text>
      </view>
      <view class="legend-item">
        <view class="legend-dot fever"></view>
        <text class="legend-text">高热 (>38.5°C)</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick, getCurrentInstance } from 'vue'
import uCharts from '@qiun/ucharts'

interface Props {
  data: Array<{
    time: string
    temperature: number
  }>
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300
})

const instance = getCurrentInstance()
let chartInstance: any = null

/**
 * 初始化图表
 */
function initChart() {
  if (!props.data || props.data.length === 0) return
  
  const query = uni.createSelectorQuery().in(instance)
  
  query.select('#temperatureChart')
    .fields({ node: true, size: true })
    .exec((res) => {
      if (!res || !res[0]) {
        console.error('Canvas node not found')
        return
      }
      
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      
      const dpr = uni.getSystemInfoSync().pixelRatio
      const width = res[0].width
      const height = res[0].height
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      
      const categories = props.data.map(item => {
        const date = new Date(item.time)
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
      })
      
      const series = [{
        name: '体温',
        data: props.data.map(item => item.temperature)
      }]
      
      chartInstance = new uCharts({
        type: 'line',
        context: ctx,
        width: width,
        height: height,
        categories,
        series,
        animation: true,
        background: '#FFFFFF',
        color: ['#FF6B6B'],
        padding: [15, 15, 15, 45],
        enableScroll: false,
        legend: {
          show: false
        },
        xAxis: {
          disableGrid: false,
          axisLine: false,
          axisLineColor: '#EEEEEE',
          gridColor: '#F5F5F5',
          gridType: 'solid',
          fontSize: 11,
          fontColor: '#999999',
          rotateLabel: false,
          lineHeight: 16
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 4,
          gridColor: '#F0F0F0',
          splitNumber: 6,
          min: 35.5,
          max: 40.5,
          fontSize: 11,
          fontColor: '#999999',
          data: [
            {
              min: 35.5,
              max: 40.5
            }
          ]
        },
        extra: {
          line: {
            type: 'curve',
            width: 2.5,
            activeType: 'hollow',
            linearType: 'custom',
            linearOpacity: 0.3,
            addLine: true,
            addLineColor: '#FF6B6B',
            addLineOpacity: 0.2
          },
          markLine: {
            type: 'dash',
            dashLength: 5,
            data: [
              {
                value: 37.3,
                lineColor: '#52C41A',
                showLabel: true,
                labelText: '正常上限',
                labelBgColor: '#52C41A',
                labelTextColor: '#FFFFFF'
              },
              {
                value: 38.5,
                lineColor: '#FAAD14',
                showLabel: true,
                labelText: '高热界限',
                labelBgColor: '#FAAD14',
                labelTextColor: '#FFFFFF'
              }
            ]
          }
        },
        dataLabel: false,
        dataPointShape: true,
        dataPointShapeType: 'solid',
        dataPointShapeColor: ['#FF6B6B', '#FFFFFF'],
        dataPointShapeBorderColor: '#FF6B6B',
        dataPointShapeBorderWidth: 2,
        dataPointShapeRadius: 4
      })
    })
}

watch(() => props.data, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initChart()
    }, 100)
  })
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
}

.chart-container {
  width: 100%;
  height: 280rpx;
  position: relative;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  margin-top: 20rpx;
  flex-wrap: wrap;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
  
  .legend-dot {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    
    &.normal {
      background: #52C41A;
    }
    
    &.low-fever {
      background: #FAAD14;
    }
    
    &.fever {
      background: #FF4D4F;
    }
  }
  
  .legend-text {
    font-size: 20rpx;
    color: #666;
  }
}
</style>
