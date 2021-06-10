<!--
 * @Author: 任智勇
 * @since: 2019-05-24 10:00:57
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-27 16:41:03
 -->
<template>
  <div class="chartDiv">
    <div class="myChart" ref="myChart"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import * as echarts from "echarts";
@Component({ components: {} })

/* 饼图封装
 * 参数含义 configure{}
 * data:动态数据值
 * color:系列颜色值
 * type: annular:环形、rose:南丁格尔玫瑰图
 * seriesName：系列名称
 * isLenged:是否开启图例 若需要自定义图例配置，此处直接传原生lenged配置属性
 * isShowLabel:是否开启文字标注
 * lengedPosition：图例位置 上、右、下、左
 * radius：图表大小 饼图半径，数组的第一项是内半径，第二项是外半径 格式：["50%","50%"] or [50,50]
 * pieTitle: 中间标题文字
 * orient：图例朝向
 * center：饼图位置
 * autoShowToolTip: 是否开启轮播显示
 * */
export default class ComponentName extends Vue {
  private ele: any;
  private chart: any;
  private config: any = {
    data: [],
    color: [
      "#33CC99",
      "#99CCFF",
      "#FFCC33",
      "#FF9999",
      "#AF80E3",
      "#11AD7B",
      "#D48265",
      "#91C7AE",
      "#C23531",
      "#D76662"
    ],
    seriesName: "",
    radius: ["30%", "50%"],
    orient: "horizontal",
    isLenged: true,
    isShowLabel: true,
    lengedSize: [25, 14],
    lengedPosition: ["bottom", "", "", "center"],
    lengedColor: "#c4def0",
    lengedBorderColor: "transparent",
    lengedBg: "transparent",
    isLable: true,
    setTopTip: null,
    pieTitle: "",
    pieTielePosition: ["center", "center"],
    titlePosition: ["center", "center"],
    pieTitleBg: "rgba(64,138,186,.2)",
    lFontSize: 14,
    tFontSize: 14,
    fontColor: "#c4def0",
    fontFamily: "Microsoft YaHei",
    isShowValue: false,
    yCompany: [],
    center: ["50%", "50%"],
    autoShowToolTip: false
  };
  private option: any = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: function(
        pos: any,
        params: any,
        dom: any,
        rect: any,
        size: any
      ) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        let obj:any = { top: 60 };
        obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      }
    },
    legend: {
      show: true,
      orient: "horizontal",
      top: "bottom",
      data: []
    },
    title: {
      text: "",
      textStyle: {
        fontSize: 16,
        color: "#333",
        fontWeight: "600"
      },
      x: "center",
      y: "center"
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: true,
        color: [], //颜色数组
        autoShowToolTip: true, // 是否开启自动轮播
        label: {
          show: true
        },
        labelLine: {
          show: true
        },
        data: []
      }
    ]
  };
  private timeTicket: any;

  // 设置prop类型
  @Prop() private configure!: object;
  @Watch("configure", { immediate: true, deep: true })
  refreshData(val: object) {
    if (this.chart) {
      this.chartConfig();
    }
  }
  mounted() {
    this.ele = this.$refs.myChart;
    this.chart = echarts.init(this.ele);
    this.chartConfig();
  }
  // 图表初始化配置
  private chartConfig() {
    var _this = this;
    // 合并参数配置
    if (this.configure) {
      Object.assign(this.config, this.configure);
    }
    _this._setChart();

    // 设置图表数据
    _this.option.series[0].data = this.config.data.map((item:any)=>{
      if(!item.value){
        item.value = null;
      }
      return item;
    });
    _this.chart.clear();
    _this.chart.setOption(_this.option);
    if (this.config.autoShowToolTip === true) {
      _this.autoShowToolTip(_this.chart, _this.option, 3000, {});
    }
  }
  // 暂无数据处理
  private _noData() {
    var _this = this;
    _this.option.series[0].data.push({ value: 0, name: "暂无数据" });
  }
  // 图表设置
  private _setChart() {
    var _this = this;
    // 根据type类型改变图表类型
    switch (_this.config.type) {
      case "annular":
        _this.option.series[0].radius = ["45%", "60%"];
        break;
      case "rose":
        _this.option.series[0].roseType = "area";
        break;
    }
    // 设置系列名称
    if(_this.config.seriesName){
        _this.option.series[0].name = _this.config.seriesName
    }
    // 设置系列颜色
    if (_this.config.color.length > 0) {
      _this.option.series[0].color = _this.config.color;
    }
    // 设置图表半径
    if (_this.config.radius) {
      _this.option.series[0].radius = _this.config.radius;
    }
    // 设置图表中间文字
    if (_this.config.pieTitle) {
      _this.option.title.text = _this.config.pieTitle;
    }
    // 设置图标位置
    if (_this.config.center) {
      _this.option.series[0].center = _this.config.center;
    }
    // 设置tooltip
    if (_this.config.tooltip) {
      _this.option.tooltip = _this.config.tooltip;
    }
    // 设置legend
    if (_this.config.isLenged === true) {
      _this.option.legend.data = []; // 清空图例名称数组
      _this.config.data.forEach(function(e: any) {
        _this.option.legend.data.push(e.name);
      });
      // 图例位置
      _this.option.legend.top = _this.config.lengedPosition[0];
      _this.option.legend.right = _this.config.lengedPosition[1];
      _this.option.legend.bottom = _this.config.lengedPosition[2];
      _this.option.legend.left = _this.config.lengedPosition[3];
    } else if (_this.config.isLenged === false) {
      _this.option.legend.show = false;
    } else {
      _this.option.legend = _this.config.legend;
    }

    // 设置label
    if (_this.config.isShowLabel === false) {
      _this.option.series[0].label.show = false;
    } else if (_this.config.isShowLabel === true) {
      _this.option.series[0].label = {
        normal: {
          formatter: _this.config.label_line1 ? [
              "{title|{b}}",
              "{title|占比：{d}%}",
              "{title|数量：{c}"+ (this.config.unit || '个') +"}"
          ].join(" ") : [
              "{title|{b}}",
              "{title|占比：{d}%}",
              "{title|数量：{c}"+ (this.config.unit || '个') +"}"
          ].join("\n"),
          fontSize: "14",
          rich: {
            title: {
              align: "left",
              color: "#333",
              lineHeight: "16"
            }
          }
        }
      };
    }
  }

  /**
   * echarts tooltip轮播（部分类型可能不支持）
   * @param chart echarts.init初始化的对象
   * @param option 配置echarts的配置信息
   * @param interval 轮播时间间隔，单位毫秒，默认为2000
   * @param params 其他参数
   * {
   *  refreshOption 更新option配置的函数（主要是更新数据，刷新echarts）
   *  isRefresh 轮播结束是否刷新（当总条数大于每页限制显示的条数则轮播时需要刷新echarts）
   * }
   * @returns {{clearTimeTicket: clearTimeTicket}}
   */
  private autoShowToolTip(
    chart: any,
    option: any,
    interval: number,
    params: any
  ) {
    let dataIndex = -1; // 数据索引，初始化为-1，是为了判断是否是第一次执行
    let seriesIndex = 0; // 系列索引
    let seriesLen = option.series.length; // 系列个数
    let dataLen = 0; // 某个系列数据个数
    let chartType: any; // 系列类型
    let _this = this;

    interval = typeof interval === "number" ? parseInt(interval + "") : 2000;
    clearInterval(_this.timeTicket);
    function autoShowTip() {
      _this.timeTicket = setInterval(function() {
        let series = option.series;
        let refreshed = false;
        chartType = series[seriesIndex].type; // 系列类型
        dataLen = series[seriesIndex].data.length; // 某个系列的数据个数

        //判断是否更新数据
        if (
          params &&
          params.isRefresh &&
          typeof params.isRefresh === "function" &&
          dataIndex === 0
        ) {
          params.refreshOption();
          chart.setOption(option);
          refreshed = true;
        }

        //第一次
        if (dataIndex < 0) {
          dataIndex = 0;
        }

        let tipParams: any = { seriesIndex: seriesIndex, name, dataIndex };
        switch (chartType) {
          case "map":
          case "pie":
          case "chord":
            tipParams[name] = series[seriesIndex].data[dataIndex].name;
            break;
          case "radar": // 雷达图
            tipParams[seriesIndex] = seriesIndex;
            tipParams[dataIndex] = dataIndex;
            break;
          default:
            tipParams[dataIndex] = dataIndex;
            break;
        }

        if (chartType === "pie" || chartType === "radar") {
          if (!refreshed) {
            // 取消之前高亮的图形
            chart.dispatchAction({
              type: "downplay",
              seriesIndex: seriesIndex === 0 ? seriesLen - 1 : seriesIndex - 1,
              dataIndex: dataIndex === 0 ? dataLen - 1 : dataIndex - 1
            });
          }

          // 高亮当前图形
          chart.dispatchAction({
            type: "highlight",
            seriesIndex: seriesIndex,
            dataIndex: dataIndex
          });
        }

        // 显示 tooltip
        tipParams.type = "showTip";
        chart.dispatchAction(tipParams);

        dataIndex = (dataIndex + 1) % dataLen;
        if (dataIndex === 0) {
          // 数据索引归0表示当前系列数据已经循环完
          seriesIndex = (seriesIndex + 1) % seriesLen;
        }
      }, interval);
    }

    // 关闭轮播
    function stopAutoShow() {
      if (_this.timeTicket) {
        clearInterval(_this.timeTicket);
        _this.timeTicket = 0;

        if (chartType === "pie" || chartType === "radar") {
          // 取消高亮的图形
          chart.dispatchAction({
            type: "downplay",
            seriesIndex: seriesIndex === 0 ? seriesLen - 1 : seriesIndex - 1,
            dataIndex: dataIndex === 0 ? dataLen - 1 : dataIndex - 1
          });
        }
      }
    }

    let zRender = chart.getZr();
    function zRenderMouseMove(param: any) {
      if (param.event) {
        // 阻止canvas上的鼠标移动事件冒泡
        param.event.cancelBubble = true;
      }

      stopAutoShow();
    }
    // 离开echarts图时恢复自动轮播
    function zRenderGlobalOut() {
      if (!_this.timeTicket) {
        autoShowTip();
      }
    }

    autoShowTip();

    // 鼠标在echarts图上时停止轮播
    chart.on("mousemove", stopAutoShow);
    zRender.on("mousemove", zRenderMouseMove);
    zRender.on("globalout", zRenderGlobalOut);

    return {
      clearTimeTicket: function() {
        clearInterval(_this.timeTicket);

        chart.off("mousemove", stopAutoShow);
        zRender.off("mousemove", zRenderMouseMove);
        zRender.off("globalout", zRenderGlobalOut);
      }
    };
  }
  // 数字格式化
  private formatDigital(number: any) {
    let result = number;
    if (!number) {
      return result;
    }
    let numberStr = number.toString();
    let pointIndex = numberStr.indexOf(".");
    let lastIndex = numberStr.length - 1;
    let point = numberStr.substr(pointIndex, lastIndex);

    if (pointIndex >= 0) {
      lastIndex = pointIndex - 1;
    }
    result = "";
    let count = 1;
    for (let i = lastIndex; i >= 0; i--, count++) {
      let temp = numberStr[i];

      result = temp + result;
      if (count % 3 === 0 && i !== 0) {
        result = "," + result;
      }
    }

    if (pointIndex >= 0) {
      return result + point;
    } else {
      return result;
    }
  }
}
</script>

<style lang='scss' scoped>
.chartDiv {
  width: 100%;
  height: 100%;
  .myChart {
    width: 100%;
    height: 100%;
  }
}
</style>
