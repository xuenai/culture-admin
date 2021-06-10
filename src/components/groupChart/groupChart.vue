<!--
 * @Author: 任智勇
 * @since: 2019-05-22 15:21:12
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-12 10:43:45
 -->
<template>
  <div class="chartDiv">
    <div class="echart" ref="chart"></div>
    <canvas id="canvas" v-if="showTips"></canvas>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as echarts from "echarts";

@Component({ components: {} })
export default class ComponentName extends Vue {
  private seriesTypes: any; // 类型中是否包含bar 类型
  private ele: any; // html 结构
  private chart: any; // echarts 对象
  private option: any = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        lineStyle: {
          color: "white"
        },
        shadowStyle: {
          color: "white"
        }
      },
      textStyle: {
        fontFamily: "",
        fontSize: 14
      }
    },
    legend: {
      top: "",
      right: "",
      bottom: "",
      left: "",
      itemWidth: "",
      itemHeight: "",
      textStyle: {
        fontSize: 14,
        fontFamily: "",
        color: ""
      },
      data: []
    },
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: false,
      borderColor: "",
      borderWidth: 1,
      show: false
    },
    xAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: ""
        }
      },
      axisLabel: {
        textStyle: {
          fontFamily: "",
          fontSize: 14,
          color: ""
        },
        interval: ""
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ""
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(0,0,0,0)", "rgba(0,0,0,.1)"]
        }
      },

      data: []
    },
    yAxis: [
      {
        type: "value",
        name: "",
        nameTextStyle: {
          color: "",
          fontSize: 14,
          fontFamily: ""
        },
        axisLine: { lineStyle: { width: 0 } },
        axisLabel: {
          textStyle: {
            color: "",
            fontSize: 14,
            fontFamily: ""
          }
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ["rgba(0,0,0,.1)", "rgba(0,0,0,0)"]
          }
        },
        splitLine: { lineStyle: { color: [""] } },
        axisTick: { show: true, length: 5, lineStyle: { color: "" } },
        data: []
      }
    ],
    toolbox: {
      show: false,
      feature: {
        dataView: { show: false, readOnly: false },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: false }
      }
    },
    series: [],
    custom: ""
  };
  private timeTicket: any = 0;
  private showTips = false;
  /*
   * 混合图形
   * 参数含义：
   * @param {object} element [juqery对象]
   * @param {object} configure [配置文件]
   * configure属性：
   * data:动态数据返回值
   * isSwitch: 是否需要切换折线、柱状图的工具按钮
   * color:系列颜色
   * tag:图表容器节点
   * seriesName:系列值名称
   * isShadow:是否开启范围阴影显示（只针对于全部为折线图有效）
   * isSmooth：是否开启平滑显示  （只针对系列类型为折线图的系列有效）
   * isZeroData：是否从0刻度线开始显示数据 （只针对于全部为折线图的有效）
   * axisPointer:坐标轴显示器 默认阴影浏览
   * gradient: 阴影颜色渐变  （只针对系列类型为折线图的系列有效）
   * seriesType:系列类型
   * transverse:是否横向显示
   * isTotalPattern:是否开启总量统计模式
   * isLenged:是否开启图例
   * lengedPosition：[] 图例位置 上,右,下,左
   * lengedSize: 图例大小
   * isAverage:是否开启平均值
   * isLable:是否开启系列单值数据显示
   * xColor:X轴、刻度线颜色值
   * xData:x轴 值分割线颜色
   * yColor:y轴刻度线颜色值
   * yData:y轴 值分割线颜色
   * fontColor:x轴、y轴字体颜色
   * fontSize:字体大小
   * fontFanmily：字体样式
   * yCompany:设置Y轴单位
   * setTopTip fn() 自定义toptip样式
   * isLableposition lable文字显示位置
   * isLableColor lable文字显示颜色
   * splitArea： 图表交换颜色显示
   * isGridShow： 去除纵坐标线后显示外边框
   * title: 图表标题
   * titleSize：图表标题字体大小
   * titleColor：图表标题字体颜色
   * titlePosition: [上,右,下,左] 图表标题 位置
   * isBiaxial：是否开启双Y轴显示，y轴显示顺序会按照数据系列顺序显示
   * yAxisIndex: 如开启双Y轴显示，yAxisIndex表示seriesName数组中第几个是双Y轴值
   * isYNum: y轴线是否是数字不出现小数点 true=无小数点 false= 有小数点
   * xRotate： x轴线上文字旋转度数
   * markLine: markLine水平标记线阀值
   * markPointMax: 是否标记最大值
   * markPointMin: 是否标记最小值
   * xLine: 控制x轴线显示或者隐藏(不包含刻度值线),
   * yLine: 控制y轴线显示或者隐藏(不包含刻度值线),
   * zoomDataLength: 区域缩放功能，传入类型为number 例： 10，组件则会自动获取数据长度，如果长度在10以内则不会显示，反之则会显示, 注：使用dataZomm请关闭轮播组件
   * dzRange:[0,50], 控制缩放功能条开始到结束的百分比，（实际就是控制拖动条的宽度占总宽度的百分之多少，进而来控制一屏展示多少条数据）
   * dzBg:'#122e41', 缩放组件背景
   * dzFillColor:'#274876',选中范围的填充颜色
   * dzBorderColor:'#3A70A2', 缩放组件的border颜色
   * yDataRange:1,   控制y轴值以什么样的单位显示，此组件用于当数据超长时y轴文字显示不全问题
   * barWidth:'65%', 控制单系列柱状图的宽度
   * lineSymbol:'emptyCircle', 控制折线图原点形态，可通过:imgage://xxx.jpg自定义
   * symbolSize:4, 折线图远点大小
   * theme:{},   主题设置  可通过json文件 config.js 配置文件来统一对项目组件共用主题颜色,注：此参数为了兼容之前单值传入控制主题，内置参数必须全部填写
   * nameGap: '',  单位位置
   * theme：{}内置参数：
   *      axisColor:"", 坐标轴显示器颜色
       xColor:"",     x轴刻度线、边线颜色控制
       xData: "",     x轴 值线颜色控制
       yColor: "",    x轴刻度线、边线颜色控制
       yData: "",     x轴 值线颜色控制
       fontColor: "", x、y、单位、legend字体颜色控制
       titleColor:"", 标题字体颜色
   *
  */

  private config: any = {
    data: [],
    isSwitch: false,
    color: [
      "#23a1ee",
      "#0dd197",
      "#19A7CB",
      "#AF80E3",
      "#11AD7B",
      "#D48265",
      "#91C7AE",
      "#C23531",
      "#D76662"
    ],
    seriesName: [""],
    seriesType: [],
    isShadow: false,
    isSmooth: true,
    isZeroData: false,
    axisPointer: "shadow",
    yCompany: ["单位：个"],
    isBiaxial: false,
    yAxisIndex: [],
    markPointMax: false,
    markPointMin: false,
    fontSize: 12,
    fontFamily: "Microsoft YaHei",
    gradient: [],
    transverse: false,
    isTotalPattern: false,
    isAverage: false,
    isLenged: false,
    lengedPosition: ["top", "", "", "center"],
    lengedSize: [14, 8],
    isLable: false,
    isLableColor: "",
    isLableposition: "top",
    autoShowToolTip: true,
    position: [50, 0, 55, 60],
    setTopTip: null,
    clearTooltip: null,
    isShowtooltip: true,
    splitArea: false,
    isGridShow: false,
    title: "",
    titleSize: "14",
    titlePosition: ["bottom", "", "", "50"],
    titleAlign: "center",
    xRotate: 0,
    TafterRotate: 0,
    markLine: 0,
    markLineVal: "最大承载量客流",
    axisColor: "rgba(0,0,0,0.1)",
    xColor: "#e6e6e6",
    xData: "#f5f5f5",
    yColor: "#e6e6e6",
    yData: "#f5f5f5",
    fontColor: "#4f5a69",
    titleColor: "#5c768c",
    xLine: true,
    yLine: true,
    zoomDataLength: 0,
    dzRange: [0, 50],
    dzBg: "#122e41",
    dzFillColor: "#274876",
    dzBorderColor: "#3A70A2",
    barWidth: "65%",
    lineSymbol: [],
    symbolSize: 4,
    companyNumber: 10000,
    theme: {},
    containPt: false,
    yAutoData: false,
    nameGap: 15,
    interval: "auto",
    barBorderRadius: [3, 3, 0, 0],
    axisZ: 2,
    customData: "",
    selectedMode: true,
    appointConfig: {
      color: "white",
      borderColor: "red",
      borderWidth: 3,
      barBorderRadius: "",
      borderType: "solid",
      legendImg: ""
    },
    setTotalPattern: [],
    xPosition: "bottom",
    y2Max: ""
  };
  // 设置prop类型
  @Prop() private configure!: object;

  @Watch("configure", { immediate: true, deep: true })
  refreshData(val: object) {
    if (this.chart) {
      this.chartConfig();
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
        try {
          chartType = series[seriesIndex].type; // 系列类型
          dataLen = series[seriesIndex].data.length; // 某个系列的数据个数
        } catch (error) {
          clearInterval(_this.timeTicket)
        }

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

        let tipParams: any = { seriesIndex: seriesIndex };
        switch (chartType) {
          case "map":
          case "pie":
          case "chord":
            tipParams.name = series[seriesIndex].data[dataIndex].name;
            break;
          case "radar": // 雷达图
            tipParams.seriesIndex = seriesIndex;
            tipParams.dataIndex = dataIndex;
            break;
          default:
            tipParams.dataIndex = dataIndex;
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
  public chartConfig() {
    let _this = this;
    let tooltip,
      chart = _this.chart;
    // 默认参数扩展
    if (this.configure && typeof this.configure === "object") {
      Object.assign(this.config, this.configure);
      _this.option.series = []; // 清空系列数据，重新载入当前配置数据
    }
    this.seriesTypes = this.config.seriesType.join().indexOf("bar");

    // 判断是否需要增加切换图表格式
    if (this.config.isSwitch === true && this.seriesTypes > -1) {
      this.option.toolbox.show = true;
      this.option.toolbox.feature.magicType.type = ["line"];
    } else if (this.config.isSwitch === true) {
      this.option.toolbox.show = true;
      this.option.toolbox.feature.magicType.type = ["bar"];
    } else {
      this.option.toolbox.show = false;
    }

    if (!_this.config.data || _this.config.data.length === 0) {
      _this._title();
      _this._legend();
      _this._toolsTip();
      _this._grid();
      _this._dataZoom();
      _this._xAxis();
      _this._yAxis();
      _this._noData();
    } else {
      _this._title();
      _this._legend();
      _this._toolsTip();
      _this._grid();
      _this._dataZoom();
      _this._xAxis();
      _this._yAxis();
      _this._addSeries();
      _this._series();
    }
    chart.clear();
    chart.setOption(_this.option);
    if (_this.config.autoShowToolTip === true) {
      tooltip = _this.autoShowToolTip(chart, _this.option, 3000, {});
    }
    typeof _this.config.clearTooltip === "function" &&
      _this.config.clearTooltip(tooltip);
  }
  // 动态添加数据系列
  private _addSeries() {
    let serverLength;
    if (!this.config.data || this.config.data.length === 0) {
      serverLength = 0;
    } else {
      serverLength = this.config.data[0].series.length||0;
    }
    if (serverLength !== this.option.series.length) {
      for (let i = 0; i < serverLength; i++) {
        if (this.config.seriesType[i] === "line") {
          this.option.series.push({
            name: "直接访问",
            type: this.config.seriesType[i],
            barCategoryGap: "60%",
            symbol: "emptyCircle",
            symbolSize: this.config.symbolSize,
            itemStyle: {
              normal: {
                color: this.config.color,
                barBorderRadius: this.config.barBorderRadius
              }
            },
            lineStyle: {
              normal: {
                opacity: 1
              }
            },
            data: []
          });
        } else {
          this.option.series.push({
            name: "直接访问",
            type: this.config.seriesType[i],
            barCategoryGap: "60%",
            itemStyle: {
              normal: {
                color: this.config.color,
                barBorderRadius: this.config.barBorderRadius
              }
            },
            data: []
          });
        }
      }
    }
  }
  // 暂无数据处理
  private _noData() {
    this.option.series.push({
      name: "",
      type: "bar",
      data: [" "]
    });
    this.option.xAxis.data.push("暂无数据");
    this.option.yAxis[0].max = 4;
    this.option.series[0].data = [" "];
    this.option.tooltip.formatter = function() {
      let str = "";
      str = "<span style='font-size: 14px'>暂无数据<span>";
      return str;
    };
  }
  // 设置title
  private _title() {
    let _this = this;
    //设置图表标题
    if (_this.config.title) {
      _this.option.title = {
        text: _this.config.title,
        textStyle: {
          fontSize: _this.config.titleSize,
          fontFamily: _this.config.fontFamily,
          align: _this.config.titleAlign,
          fontWeight: 'nomarl'
        },
        top: _this.config.titlePosition[0],
        right: _this.config.titlePosition[1],
        bottom: _this.config.titlePosition[2],
        left: _this.config.titlePosition[3]
      };
      // 判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数titleColor来设置
      if (JSON.stringify(_this.config.theme) === "{}") {
        _this.option.title.textStyle.color = _this.config.titleColor;
      } else {
        _this.option.title.textStyle.color = _this.config.theme.titleColor;
      }
    }
  }
  // 设置legend
  private _legend() {
    let _this = this;
    _this.option.legend = {
      top: this.config.lengedPosition[0],
      right: this.config.lengedPosition[1],
      bottom: this.config.lengedPosition[2],
      left: this.config.lengedPosition[3],
      itemWidth: this.config.lengedSize[0],
      itemHeight: this.config.lengedSize[1],
      selectedMode: this.config.selectedMode,
      textStyle: {
        fontSize: this.config.fontSize,
        fontFamily: this.config.fontFamily,
        color: ""
      },
      data: []
    };
    // 判断是否显示legend
    if (_this.config.isLenged === true) {
      _this.option.legend.show = true;
      _this.config.seriesName.forEach(function(e: any, i: any) {
        _this.option.legend.data.push({ name: e, icon: "" });
      });
    } else {
      _this.option.legend.show = false;
    }
    // 判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数yColor、yData、fontColor来设置
    if (JSON.stringify(_this.config.theme) === "{}") {
      _this.option.legend.textStyle.color = this.config.fontColor;
    } else {
      _this.option.legend.textStyle.color = this.config.theme.fontColor;
    }
  }
  // 设置toolTip
  private _toolsTip() {
    let _this = this;
    _this.option.tooltip = {
      show: true,
      trigger: "axis",
      backgroundColor: "",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: this.config.axisPointer, // 默认为直线，可选为：'line' | 'shadow'
        lineStyle: {
          color: ""
        },
        shadowStyle: {
          color: ""
        },
        z: this.config.axisZ
      },
      textStyle: {
        fontFamily: this.config.fontFamily,
        fontSize: this.config.fontSize
      }
    };
    // 判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数axisColor来设置
    if (JSON.stringify(_this.config.theme) === "{}") {
      _this.option.tooltip.axisPointer.lineStyle.color = _this.config.axisColor;
      _this.option.tooltip.axisPointer.shadowStyle.color =
        _this.config.axisColor;
      _this.option.tooltip.backgroundColor = "rgba(50,50,50,0.7)";
    } else {
      _this.option.tooltip.axisPointer.lineStyle.color =
        _this.config.theme.axisColor;
      _this.option.tooltip.axisPointer.shadowStyle.color =
        _this.config.theme.axisColor;
      _this.option.tooltip.backgroundColor = _this.config.theme.toolTipBg;
    }
    // 自定义toolTip方法
    if (typeof _this.config.setTopTip === "function") {
      _this.option.tooltip.formatter = function(param: any) {
        return _this.config.setTopTip(param, _this.option);
      };
    }

    // 是否设置tooltip默认背景为none
    if (_this.config.tooltipBg === false) {
      _this.option.tooltip.backgroundColor = "none";
    }
    // 判断是否开启悬浮框
    if (_this.config.isShowtooltip === true) {
      _this.option.tooltip.show = true;
    } else {
      _this.option.tooltip.show = false;
    }
  }
  // 设置grid
  private _grid() {
    let _this = this;
    _this.option.grid = {
      show: this.config.isGridShow,
      top: this.config.position[0],
      right: this.config.position[1],
      bottom: this.config.position[2],
      left: this.config.position[3],
      containLabel: false,
      borderColor: this.config.theme.xColor,
      borderWidth: 1
    };
    // 判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数xColor来设置
    if (JSON.stringify(_this.config.theme) === "{}") {
      _this.option.grid.borderColor = this.config.xColor;
    } else {
      _this.option.grid.borderColor = this.config.theme.xColor;
    }
  }
  // 设置x轴
  private _xAxis() {
    let _this = this;
    _this.option.xAxis = {
      position: _this.config.xPosition,
      axisLine: {
        show: true,
        lineStyle: {
          color: ""
        }
      },
      axisLabel: {
        textStyle: {
          fontFamily: this.config.fontFamily,
          fontSize: this.config.fontSize,
          color: ""
        },
        interval: _this.config.interval
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ""
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(0,0,0,0)", "rgba(0,0,0,.1)"]
        }
      },
      data: []
    };
    // 判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数xColor、xData、fontColor来设置
    if (JSON.stringify(_this.config.theme) === "{}") {
      _this.option.xAxis.axisLine.lineStyle.color = _this.config.xColor;
      _this.option.xAxis.axisLabel.textStyle.color = _this.config.fontColor;
      _this.option.xAxis.splitLine.lineStyle.color = _this.config.xData;
    } else {
      _this.option.xAxis.axisLine.lineStyle.color = _this.config.theme.xColor;
      _this.option.xAxis.axisLabel.textStyle.color =
        _this.config.theme.fontColor;
      _this.option.xAxis.splitLine.lineStyle.color = _this.config.theme.xData;
    }
    // 是否从0刻度线开始显示数据
    if (_this.config.isZeroData === true && _this.seriesTypes < 0) {
      _this.option.xAxis.boundaryGap = false;
    }
    // 设置分类名称翻转 and 开启双颜色替换
    if (_this.config.transverse === false) {
      _this.option.xAxis.axisLabel.rotate = _this.config.xRotate;
      _this.option.xAxis.splitArea.show = _this.config.splitArea;
    } else {
      this.option.xAxis.axisLabel.rotate = _this.config.TafterRotate;
    }
    // 设置xdataLine显示隐藏
    if (_this.config.xLine === false) {
      _this.option.xAxis.splitLine.show = false;
    }
  }
  // 设置区域缩放
  private _dataZoom() {
    let _this = this;
    if (
      _this.config.zoomDataLength > 0 &&
      _this.config.data.length > _this.config.zoomDataLength
    ) {
      _this.option.dataZoom = {
        show: true,
        start: _this.config.dzRange[0],
        end: _this.config.dzRange[1],
        zoomLock: true,
        showDetail: false,
        backgroundColor: _this.config.dzBg,
        fillerColor: _this.config.dzFillColor,
        borderColor: _this.config.dzBorderColor
      };
      _this.option.grid.bottom = this.config.position[2] + 35;
    }
  }
  // 设置Y轴
  private _yAxis() {
    let _this = this;
    _this.option.yAxis = [
      {
        type: "value",
        name: "",
        nameGap: _this.config.nameGap,
        nameTextStyle: {
          fontSize: this.config.fontSize,
          fontFamily: this.config.fontFamily,
          color: ""
        },
        axisLine: { show: true, lineStyle: { color: "" } },
        axisLabel: {
          textStyle: {
            fontSize: this.config.fontSize,
            fontFamily: this.config.fontFamily,
            color: ""
          }
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ["rgba(0,0,0,.1)", "rgba(0,0,0,0)"]
          }
        },
        splitLine: { lineStyle: { color: [] } },
        axisTick: { show: true, length: 5, lineStyle: { color: "" } },
        data: []
      }
    ];
    // 判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数yColor、yData、fontColor来设置
    if (JSON.stringify(_this.config.theme) === "{}") {
      _this.option.yAxis[0].nameTextStyle.color = _this.config.fontColor;
      _this.option.yAxis[0].axisLabel.textStyle.color = _this.config.fontColor;
      _this.option.yAxis[0].splitLine.lineStyle.color[0] = _this.config.yData;
      _this.option.yAxis[0].axisTick.lineStyle.color = _this.config.yColor;
      _this.option.yAxis[0].axisLine.lineStyle.color = _this.config.yColor;
    } else {
      _this.option.yAxis[0].nameTextStyle.color = _this.config.theme.fontColor;
      _this.option.yAxis[0].axisLabel.textStyle.color =
        _this.config.theme.fontColor;
      _this.option.yAxis[0].splitLine.lineStyle.color[0] =
        _this.config.theme.yData;
      _this.option.yAxis[0].axisTick.lineStyle.color =
        _this.config.theme.yColor;
      _this.option.yAxis[0].axisLine.lineStyle.color =
        _this.config.theme.yColor;
    }
    // 设置Y轴data线显示隐藏
    if (_this.config.yLine === false) {
      _this.option.yAxis[0].splitLine.show = false;
    }
    if (_this.config.transverse === true) {
      _this.option.yAxis[0].axisLabel.rotate = _this.config.xRotate;
      _this.option.yAxis[0].splitArea.show = _this.config.splitArea;
    }
  }
  // 设置数据系列系列参数
  private _series() {
    let _this = this;
    // 设置系列数据值
    _this.config.data.forEach(function(dataItem: any, i: any) {
      if (_this.config.transverse === false) {
        _this.option.xAxis.type = "category";
        _this.option.yAxis[0].type = "value";
        _this.option.xAxis.data.push(dataItem.ydata);
      } else {
        _this.option.xAxis.type = "value";
        _this.option.yAxis[0].type = "category";
        _this.option.yAxis[0].data.push(dataItem.ydata);
        _this.option.series.forEach(function(e: any) {
          e.itemStyle.normal.barBorderRadius = _this.config.barBorderRadius;
        });
      }
      dataItem.series.forEach(function(valueItem: any, i: number) {
        _this.option.series[i].data.push({
          value: valueItem,
          itemStyle: {
            normal: {
              borderWidth: ""
            }
          }
        });
      });
    });
    // 如果系列值为1，系列类型为0
    if (
      _this.option.series.length === 1 &&
      _this.config.seriesType.length === 0
    ) {
      this.option.series[0].type = "bar";
    }
    // 给不同的系列设置颜色、名称
    _this.option.series.forEach(function(e: any, i: any) {
      e.name = _this.config.seriesName[i];
      e.company = _this.config.yCompany;
      if (_this.config.isTotalPattern === true) {
        if (e.type === "bar" && _this.config.setTotalPattern.length < 2) {
          e.barWidth = _this.config.barWidth;
        }
        e.label = {
          normal: {
            show: _this.config.isLable,
            color: _this.config.isLableColor,
            position: _this.config.isLableposition,
            fontFamily: _this.config.fontFamily
          }
        };

        if (_this.config.setTotalPattern.length > 0) {
          _this.config.setTotalPattern.forEach(function(a: any, b: any) {
            a.forEach(function(c: any, d: any) {
              if (e.name === c) {
                e.stack = "sum" + b;
              }
            });
          });
        } else {
          e.label = {
            normal: {
              show: _this.config.isLable,
              position: "inside",
              fontFamily: _this.config.fontFamily
            }
          };
          e.stack = "总量";
        }
      }
      // 是否开启数据单值显示
      if (_this.config.isLable === true) {
        if (_this.config.isTotalPattern === false) {
          e.label = {
            normal: {
              show: true,
              color: _this.config.isLableColor,
              position: _this.config.isLableposition,
              fontFamily: _this.config.fontFamily
            }
          };
        }
      }
      // 设置空心bar
      e.data.forEach(function(j: any) {
        if (e.type === "line") {
          j.itemStyle.normal.borderWidth = 1;
        }
      });

      // 是否开启最大最小值
      let markPoint: any = [];
      if (_this.config.markPointMax === true) {
        markPoint.push({ type: "max", name: "最大值" });
      }
      if (_this.config.markPointMin === true) {
        markPoint.push({ type: "min", name: "最小值" });
      }
      e.markPoint = {
        data: markPoint
      };
      // 设置折线图的节点形态
      // if (_this.config.lineSymbol.length > 0 && e.type === 'line'){
      //     e.symbol = _this.config.lineSymbol[i];
      // }

      let arr: any = [];
      _this.config.seriesType.forEach(function(e: any, i: any) {
        if (e === "bar") {
          arr.push(e);
        }
      });
      // 如果柱状图就只有一个的时候可自定义柱状图的宽度
      if (arr.length < 2 && _this.config.isTotalPattern === false) {
        e.barWidth = _this.config.barWidth;
      }
      // 数据为单条数据并且为bar类型时 改变宽度
      if (
        _this.option.series.length === 1 &&
        _this.option.series[0].type === "bar"
      ) {
        e.barWidth = _this.config.barWidth;
      }
      // 是否开启平均值
      if (_this.config.isAverage === true) {
        e.markLine = {
          data: [{ type: "average", name: "平均值" }]
        };
      }
      e.itemStyle.normal.color = _this.config.color[i];
      // 是否开启系列范围显示（只限折线图）
      if (_this.seriesTypes < 0 && _this.config.isShadow === true) {
        if (_this.config.gradient.length === 0 || !_this.config.gradient) {
          e.areaStyle = {
            normal: {}
          };
        } else {
          e.areaStyle = {
            normal: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [],
                globalCoord: false // 缺省为 false
              }
            }
          };
        }
      }
      // 是否开启平滑曲线
      if (e.type === "line" && _this.config.isSmooth === true) {
        e.smooth = true;
      }
    });
    // 阴影区域颜色渐变
    if (
      _this.config.gradient &&
      _this.config.isShadow === true &&
      _this.seriesTypes < 0
    ) {
      for (let j = 0; j < _this.config.gradient.length; j++) {
        for (let k = 0; k < _this.config.gradient[0].length; k++) {
          _this.option.series[j].areaStyle.normal.color.colorStops[k] = {
            offset: k,
            color: _this.config.gradient[j][k]
          };
        }
      }
    }
    // 设置双Y轴
    if (_this.option.series.length > 1 && _this.config.isBiaxial === true) {
      _this.option.series.forEach(function(e: any, i: any) {
        if (
          _this.config.yAxisIndex.length > 0 &&
          _this.config.yAxisIndex.indexOf(e.name) >= 0
        ) {
          e.yAxisIndex = 1;
        } else if (_this.config.yAxisIndex.length <= 0) {
          if (i === 2) {
            return false;
          } else {
            e.yAxisIndex = i;
          }
        }
      });
      //  判断如果配置主题文件不为空那么就采用主题文件配置参数，为空则采用源参数yColor、yData、fontColor来设置
      if (JSON.stringify(_this.config.theme) === "{}") {
        _this.option.yAxis.push({
          type: "value",
          name: "yuan",
          nameGap: this.config.nameGap,
          axisLine: { lineStyle: { width: 0 } },
          axisLabel: {
            textStyle: {
              color: this.config.fontColor,
              fontSize: this.config.fontSize,
              fontFamily: this.config.fontFamily
            }
          },
          splitLine: { show: false, lineStyle: { color: _this.config.yData } },
          axisTick: {
            show: false,
            length: 5,
            lineStyle: { color: _this.config.yColor }
          }
        });
      } else {
        _this.option.yAxis.push({
          type: "value",
          name: "",
          nameGap: this.config.nameGap,
          axisLine: { lineStyle: { width: 0 } },
          axisLabel: {
            textStyle: {
              color: this.config.theme.fontColor,
              fontSize: this.config.fontSize,
              fontFamily: this.config.fontFamily
            }
          },
          splitLine: { lineStyle: { color: _this.config.theme.yData } },
          axisTick: {
            show: false,
            length: 5,
            lineStyle: { color: _this.config.theme.yColor }
          }
        });
      }
    }
    // 设置Y轴显示单位
    if (_this.config.yCompany.length) {
      _this.option.yAxis.forEach(function(e: any, i: any) {
        e.name = _this.config.yCompany[i];
        e.nameTextStyle = {
          fontSize: _this.config.fontSize,
          fontFamily: _this.config.fontFamily
        };
        if (JSON.stringify(_this.config.theme) === "{}") {
          e.nameTextStyle.color = _this.config.fontColor;
        } else {
          e.nameTextStyle.color = _this.config.theme.fontColor;
        }
        if (i > 0) {
          e.splitLine = {
            lineStyle: {
              width: 0,
              color: "#274456"
            }
          };
        }
      });
    }
    // 设置第二根Y轴最大值
    if (_this.config.isBiaxial === true && _this.config.y2Max) {
      _this.option.yAxis[1].max = _this.config.y2Max;
    }
    let computeUnit = true; //与最大承载量是否换算
    // 设置自动计算Y轴
    if (_this.config.yAutoData === true) {
      if (_this.config.isBiaxial === false) {
        let y1data: any = [];
        _this.option.series.forEach(function(e: any, i: any) {
          e.data.forEach(function(j: any, k: any) {
            y1data.push(j.value);
          });
        });
        let ymaxData = Math.max.apply(null, y1data);
        if (_this.config.companyNumber < ymaxData && ymaxData < 99999999) {
          computeUnit = false;
          _this.option.series.forEach(function(e: any, i: any) {
            e.data.forEach(function(a: any, c: any) {
              e.data[c].value = a.value / 10000;
            });
          });
          let company = _this.option.yAxis[0].name;
          let arr = company.split("：");
          _this.option.yAxis[0].name = "单位：万" + arr[1];
          _this.autoEvent(ymaxData / 10000, 0);
        } else if (ymaxData > 99999999) {
          computeUnit = false;
          _this.option.series.forEach(function(e: any, i: any) {
            e.data.forEach(function(a: any, c: any) {
              e.data[c].value = a.value / 100000000;
            });
          });
          let company = _this.option.yAxis[0].name;
          let arr = company.split("：");
          _this.option.yAxis[0].name = "单位：亿" + arr[1];
          _this.autoEvent(ymaxData / 100000000, 0);
        }
      } else {
        // 判断在自定义y2轴的情况下计算y轴值
        if (_this.config.yAxisIndex.length > 0) {
          let ydatas: any = [],
            y1datas: any = [];
          // 判断如果不包含百分比的情况，各自轴计算自己的最大值
          if (_this.config.containPt === false) {
            let name = _this.config.yAxisIndex;
            _this.option.series.forEach(function(e: any, i: any) {
              // 判断如果自定义y轴的名字等于系列名称，则当前系列为y2轴并取值
              if (name[0] === e.name) {
                e.data.forEach(function(a: any, c: any) {
                  y1datas.push(a.value);
                });
              } else {
                e.data.forEach(function(a: any, c: any) {
                  ydatas.push(a.value);
                });
              }
            });
            let ymaxData = Math.max.apply(null, ydatas),
              y1maxData = Math.max.apply(null, y1datas);
            // 判断非y2轴的值的最大值并处理为以万为单位
            if (_this.config.companyNumber < ymaxData && ymaxData < 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (e.name !== name[0]) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 10000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：万" + arr[1];
              _this.autoEvent(ymaxData / 10000, 0);
            } else if (ymaxData > 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (e.name !== name[0]) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 100000000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：亿" + arr[1];
              _this.autoEvent(ymaxData / 100000000, 0);
            }
            // 判断y2轴的值的最大值并处理为以万为单位
            if (
              _this.config.companyNumber < y1maxData &&
              y1maxData < 99999999
            ) {
              _this.option.series.forEach(function(e: any, i: any) {
                computeUnit = false;
                if (name[0] === e.name) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 10000;
                  });
                }
                let company = _this.option.yAxis[1].name;
                let arr = company.split("：");
                _this.option.yAxis[1].name = "单位：万" + arr[1];
                _this.autoEvent(y1maxData / 10000, 1);
              });
            } else if (y1maxData > 99999999) {
              _this.option.series.forEach(function(e: any, i: any) {
                computeUnit = false;
                if (name[0] === e.name) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 100000000;
                  });
                }
                let company = _this.option.yAxis[1].name;
                let arr = company.split("：");
                _this.option.yAxis[1].name = "单位：亿" + arr[1];
                _this.autoEvent(y1maxData / 100000000, 1);
              });
            }
            // 如果包含百分比的情况 y2轴不进行计算
          } else {
            let name = _this.config.yAxisIndex;
            // 取出非y2轴的值
            _this.option.series.forEach(function(e: any, i: any) {
              if (name[0] !== e.name) {
                e.data.forEach(function(a: any, c: any) {
                  ydatas.push(a.value);
                });
              }
            });
            let ymaxData = Math.max.apply(null, ydatas);
            if (_this.config.companyNumber < ymaxData && ymaxData < 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (e.name !== name[0]) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 10000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：万" + arr[1];
              _this.autoEvent(ymaxData / 10000, 0);
            } else if (ymaxData > 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (e.name !== name[0]) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 100000000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：亿" + arr[1];
              _this.autoEvent(ymaxData / 100000000, 0);
            }
          }
          // 判断没有自定义y2轴的时候，来计算y1、y2轴
        } else {
          // 不包含百分比的时候计算 双轴的值
          if (_this.config.containPt === false) {
            let y1Data: any = [],
              y2Data: any = [];
            _this.option.series.forEach(function(e: any, i: any) {
              if (i === 1) {
                e.data.forEach(function(a: any, c: any) {
                  y2Data.push(a.value);
                });
              } else {
                e.data.forEach(function(a: any, c: any) {
                  y1Data.push(a.value);
                });
              }
            });
            let y1maxData = Math.max.apply(null, y1Data),
              y2maxData = Math.max.apply(null, y2Data);
            // 判断非第二个Y轴的值的大小，并计算是否换算成以万为单位
            if (
              _this.config.companyNumber < y1maxData &&
              y1maxData < 99999999
            ) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (i !== 1) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 10000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：万" + arr[1];
              _this.autoEvent(y1maxData / 10000, 0);
            } else if (y1maxData > 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (i !== 1) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 100000000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：亿" + arr[1];
              _this.autoEvent(y1maxData / 100000000, 0);
            }
            // 判断第二个Y轴值得大小，并计算是否换算成是否已万为单位
            if (
              _this.config.companyNumber < y2maxData &&
              y2maxData < 99999999
            ) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (i === 1) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 10000;
                  });
                }
              });
              let company = _this.option.yAxis[1].name;
              let arr = company.split("：");
              _this.option.yAxis[1].name = "单位：万" + arr[1];
              _this.autoEvent(y2maxData / 10000, 1);
            } else if (y2maxData > 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (i === 1) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 100000000;
                  });
                }
              });
              let company = _this.option.yAxis[1].name;
              let arr = company.split("：");
              _this.option.yAxis[1].name = "单位：亿" + arr[1];
              _this.autoEvent(y2maxData / 100000000, 1);
            }
            // 判断包含百分比的时候
          } else {
            let y1Data: any = [];
            _this.option.series.forEach(function(e: any, i: any) {
              if (i !== 1) {
                e.data.forEach(function(a: any, c: any) {
                  y1Data.push(a.value);
                });
              }
            });
            let y1maxData = Math.max.apply(null, y1Data);
            // 判断非y2轴的值，并计算是否还算为以万为单位
            if (
              _this.config.companyNumber < y1maxData &&
              y1maxData < 99999999
            ) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (i !== 1) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 10000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：万" + arr[1];
              _this.autoEvent(y1maxData / 10000, 0);
            } else if (y1maxData > 99999999) {
              computeUnit = false;
              _this.option.series.forEach(function(e: any, i: any) {
                if (i !== 1) {
                  e.data.forEach(function(a: any, c: any) {
                    e.data[c].value = a.value / 100000000;
                  });
                }
              });
              let company = _this.option.yAxis[0].name;
              let arr = company.split("：");
              _this.option.yAxis[0].name = "单位：亿" + arr[1];
              _this.autoEvent(y1maxData / 100000000, 0);
            }
          }
        }
      }
    }
    // 设置最大值
    let ydata: any = [],
      y1datas: any = [];
    _this.option.series.forEach(function(e: any, i: any) {
      e.data.forEach(function(a: any, c: any) {
        if (_this.config.isBiaxial === true) {
          if (e.yAxisIndex > 0) {
            y1datas.push(a.value);
          } else {
            ydata.push(a.value);
          }
        } else {
          ydata.push(a.value);
        }
      });
    });

    // 判断普通y轴数据大小
    let ymaxData = Math.max.apply(null, ydata);
    let y1maxData = Math.max.apply(null, y1datas);
    if (ymaxData <= 4) {
      if (_this.config.transverse === false) {
        _this.option.yAxis[0].max = 4;
      } else {
        _this.option.xAxis.max = 4;
      }
    }
    if (!_this.config.y2Max) {
      if (y1datas.length > 0 && y1maxData <= 4) {
        if (_this.config.transverse === false) {
          _this.option.yAxis[1].max = 4;
        } else {
          _this.option.xAxis[1].max = 4;
        }
      }
    }

    // 设置最大承载量
    if (
      _this.config.transverse === false &&
      _this.option.series.length > 0 &&
      _this.config.markLine > 0
    ) {
      if (!computeUnit) {
        _this.config.markLine =
          _this.config.markLine / _this.config.companyNumber;
      }
      if (_this.config.markLine > ymaxData) {
        _this.option.yAxis[0].max = _this.config.markLine;
      }
      _this.option.series[0].markLine = {
        silent: true,
        data: [
          {
            yAxis: _this.config.markLine,
            itemStyle: {
              normal: {
                color: "#e83a26",
                label: {
                  formatter: function(parames: any) {
                    let unit = _this.option.yAxis[0].name.split("：")[1];

                    return (
                      _this.config.markLineVal +
                      _this.formatDigital(parames.value) +
                      unit +
                      "\n"
                    );
                  },
                  textStyle: {
                    align: "right",
                    baseline: "bottom",
                    fontSize: _this.config.fontSize,
                    fontFamily: "Microsoft yaHei"
                  }
                }
              }
            }
          }
        ]
      };
    }
  }

  // 自动计算数据值的大小如果值小于4 则y洲最大值为4
  private autoEvent(maxNumber: any, number: any) {
    let _this = this;
    if (maxNumber <= 4) {
      if (_this.config.transverse === false) {
        _this.option.yAxis[number].max = 4;
      } else {
        _this.option.xAxis.max = 4;
      }
    }
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
    result = '';
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
  mounted() {
    this.ele = this.$refs.chart;
    let _this = this;
    setTimeout(() => {
      _this.chart = echarts.init(_this.ele);
      _this.chartConfig();
    }, 200);
  }
}
</script>

<style lang='scss' scoped>
.chartDiv {
  width: 100%;
  height: 100%;
  .echart {
    width: 100%;
    height: 100%;
  }
}
</style>
