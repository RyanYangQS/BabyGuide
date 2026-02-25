"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TemperatureChart",
  props: {
    data: {},
    height: { default: 300 }
  },
  setup(__props) {
    const props = __props;
    const instance = common_vendor.getCurrentInstance();
    function initChart() {
      if (!props.data || props.data.length === 0)
        return;
      const query = common_vendor.index.createSelectorQuery().in(instance);
      query.select("#temperatureChart").fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0]) {
          common_vendor.index.__f__("error", "at src/components/TemperatureChart.vue:61", "Canvas node not found");
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
        const width = res[0].width;
        const height = res[0].height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        const categories = props.data.map((item) => {
          const date = new Date(item.time);
          return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
        });
        const series = [{
          name: "体温",
          data: props.data.map((item) => item.temperature)
        }];
        new common_vendor.uCharts({
          type: "line",
          context: ctx,
          width,
          height,
          categories,
          series,
          animation: true,
          background: "#FFFFFF",
          color: ["#FF6B6B"],
          padding: [15, 15, 15, 45],
          enableScroll: false,
          legend: {
            show: false
          },
          xAxis: {
            disableGrid: false,
            axisLine: false,
            axisLineColor: "#EEEEEE",
            gridColor: "#F5F5F5",
            gridType: "solid",
            fontSize: 11,
            fontColor: "#999999",
            rotateLabel: false,
            lineHeight: 16
          },
          yAxis: {
            gridType: "dash",
            dashLength: 4,
            gridColor: "#F0F0F0",
            splitNumber: 6,
            min: 35.5,
            max: 40.5,
            fontSize: 11,
            fontColor: "#999999",
            data: [
              {
                min: 35.5,
                max: 40.5
              }
            ]
          },
          extra: {
            line: {
              type: "curve",
              width: 2.5,
              activeType: "hollow",
              linearType: "custom",
              linearOpacity: 0.3,
              addLine: true,
              addLineColor: "#FF6B6B",
              addLineOpacity: 0.2
            },
            markLine: {
              type: "dash",
              dashLength: 5,
              data: [
                {
                  value: 37.3,
                  lineColor: "#52C41A",
                  showLabel: true,
                  labelText: "正常上限",
                  labelBgColor: "#52C41A",
                  labelTextColor: "#FFFFFF"
                },
                {
                  value: 38.5,
                  lineColor: "#FAAD14",
                  showLabel: true,
                  labelText: "高热界限",
                  labelBgColor: "#FAAD14",
                  labelTextColor: "#FFFFFF"
                }
              ]
            }
          },
          dataLabel: false,
          dataPointShape: true,
          dataPointShapeType: "solid",
          dataPointShapeColor: ["#FF6B6B", "#FFFFFF"],
          dataPointShapeBorderColor: "#FF6B6B",
          dataPointShapeBorderWidth: 2,
          dataPointShapeRadius: 4
        });
      });
    }
    common_vendor.watch(() => props.data, () => {
      common_vendor.nextTick$1(() => {
        initChart();
      });
    }, { deep: true });
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        setTimeout(() => {
          initChart();
        }, 100);
      });
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3234bcc4"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/TemperatureChart.js.map
