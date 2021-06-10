<template>
  <div class="container">
    <div class="map" ref="map"></div>
    <Tabs type="card" class="tabs" v-model="currTab">
      <TabPane label="景点" name="getScenicPt">
        <BaseTable class="list-box" :configure="tableConfig_scenicpt" @getList="getScenicPt">
          <Table border :columns="tableData_scenicpt.headList" :data="tableData_scenicpt.bodyList"
            size="default">
            <template slot-scope="{ row }" slot="position">
              {{ `${row.longitude},${row.latitude}` }}
            </template>
            <template slot-scope="{ row }" slot="audio">
              <template v-if="row.audio">
                <Icon type="ios-volume-up" class="icon-audio" :class="{play: tableData_scenicpt.bodyList[row._index].playing}"
                  @click="playAudio(row)" :size="24" />
                {{ row.audioTime ? `${row.audioTime}` : '' }}
              </template>
              <template v-else>--</template>
            </template>
            <template slot-scope="{ row }" slot="summary">
              <p :title="row.summary" class="line2">{{ row.summary || '--' }}</p>
            </template>
            <template slot-scope="{ row }" slot="action">
              <a @click="() => { lonLatPop = true; lonLatUpdate = {resourceId: row.resourceId, resourceType: row.resourceType}; row.latitude ? lonLatParams.lonLat = `${row.longitude},${row.latitude}` : '' }"
                href="javascript:;" class="control" style="margin: 0 10px">编辑</a>
              <dropCode class="control" :id="'qrcode' + row._index"
                :value="`${$store.state.app.userInfo.h5Domain}/#/spot-detail/${row.resourceId}`">
                <span class="control">二维码</span>
              </dropCode>
            </template>
          </Table>
        </BaseTable>
      </TabPane>
      <TabPane label="厕所" name="getToilet">
        <BaseTable class="list-box" :configure="tableConfig_toilet" @getList="getToilet">
          <Table border :columns="tableData_toilet.headList" :data="tableData_toilet.bodyList"
            size="default">
            <template slot-scope="{ row }" slot="position">
              {{ `${row.longitude},${row.latitude}` }}
            </template>
            <template slot-scope="{ row }" slot="action">
              <a @click="() => { lonLatPop = true; lonLatUpdate = {resourceId: row.resourceId, resourceType: row.resourceType}; row.latitude ? lonLatParams.lonLat = `${row.longitude},${row.latitude}` : '' }"
                href="javascript:;" class="control">编辑</a>
            </template>
          </Table>
        </BaseTable>
      </TabPane>
      <TabPane label="停车场" name="getPark">
        <BaseTable class="list-box" :configure="tableConfig_park" @getList="getPark">
          <Table border :columns="tableData_park.headList" :data="tableData_park.bodyList"
            size="default">
            <template slot-scope="{ row }" slot="position">
              {{ `${row.longitude},${row.latitude}` }}
            </template>
            <template slot-scope="{ row }" slot="action">
              <a @click="() => { lonLatPop = true; lonLatUpdate = {resourceId: row.resourceId, resourceType: row.resourceType}; row.latitude ? lonLatParams.lonLat = `${row.longitude},${row.latitude}` : '' }"
                href="javascript:;" class="control">编辑</a>
            </template>
          </Table>
        </BaseTable>
      </TabPane>
      <!-- 暂时莫得餐厅 -->
      <!-- <TabPane label="餐厅" name="getRestaurant">
        <BaseTable class="list-box" :configure="tableConfig_restaurant" @getList="getRestaurant">
          <Table border :columns="tableData_restaurant.headList" :data="tableData_restaurant.bodyList" size="default">
            <template slot-scope="{ row }" slot="position">
              {{ `${row.longitude},${row.latitude}` }}
            </template>
            <template slot-scope="{ row }" slot="action">
              <a @click="() => { lonLatPop = true; lonLatUpdate = {resourceId: row.resourceId, resourceType: row.resourceType}; row.latitude ? lonLatParams.lonLat = `${row.longitude},${row.latitude}` : '' }" href="javascript:;" class="control">编辑</a>
            </template>
          </Table>
        </BaseTable>
      </TabPane> -->
      <TabPane label="线路" name="getLine">
        <Tabs v-model="currLineId">
          <TabPane :label="line.name" v-for="line in lines" :key="line.key" :name="String(line.id)">
            <div class="line title">
              <div>景点名称</div>
              <div>经纬度</div>
              <div>建议游玩时间</div>
              <div>操作</div>
            </div>
            <template v-if="line.points && line.points.length">
              <ul class="point-list">
                <li class="line" v-for="(pt, i) in line.points" :key="pt.key"
                    v-dragging="{ list: line.points, item: pt, group: `group_${line.id}` }">
                  <div>{{ pt.name }}</div>
                  <div :class="{bgred: pt.red}">
                    <Input disabled style="width: 145px" v-model="pt.position" @on-blur="mdPosition(pt)"/>
                  </div>
                  <div>
                    <InputNumber class="input" :precision="0" :min="1" :max="999" v-model="pt.playTime"></InputNumber> 分钟</div>
                  <div>
                    <Button class="mr5" :disabled="onInsert"
                      @click="$Modal.confirm({title: '系统提示',content: '是否确认删除？',onOk:()=>{line.points.splice(i, 1); updatePolyLine(); updateSingleMarker(pt, 0)} })">删除</Button>
                    <Button @click="insertHandle(i, onInsert && insertIndex === i)"
                      :type="(onInsert && insertIndex === i)?'primary':undefined">{{(onInsert && insertIndex === i)?'从其后插入':'插入辅助点'}}</Button>
                  </div>
                </li>
              </ul>
              <Button type="primary" long style="margin-top: 20px" @click="saveGuidedTourRouteResource()">保存以上修改</Button>
            </template>
            <p class="nodata2" v-else>暂无数据</p>
          </TabPane>
          <div class="btns" slot="extra">
            <p class="nodata" v-if="lines.length === 0">暂无数据</p>
            <Button size="small" class="mr5" @click="clickHandleLine(0)">添加线路</Button>
            <Button size="small" class="mr5" @click="clickHandleLine(1)">修改线路</Button>
            <Button size="small" class="mr5" @click="deleteLine()">删除线路</Button>
          </div>
        </Tabs>
      </TabPane>
      <Button size="small" slot="extra" @click="downLoad">下载景点二维码</Button>
    </Tabs>

    <!-- 经纬度弹出 -->
    <Modal v-model="lonLatPop" title="编辑经纬度">
      <Form ref="lonLatPop" :model="lonLatParams" :rules="ruleValidatelonLat" :label-width="60">
        <FormItem label="经纬度" prop="lonLat" style="margin-bottom: 5px">
          <Input v-model="lonLatParams.lonLat" placeholder="请填写经纬度（例：116.327911,39.939229）"
            class="w360" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="lonLatPop = false">取消</Button>
        <Button type="primary" :loading="lonLatPopLoading" @click="updatePosition">确定</Button>
      </div>
    </Modal>
    <!-- 添加线路 -->
    <Modal v-model="linePop" :title="lineParams.id?'修改线路':'添加线路'">
      <Form ref="linePop" :model="lineParams" :rules="ruleValidatelonLine" :label-width="80">
        <FormItem label="线路名称" prop="name">
          <Input v-model="lineParams.name" placeholder="请填写线路名称" />
        </FormItem>
        <FormItem label="游览方式" prop="tourWay">
          <Input v-model="lineParams.tourWay" placeholder="请填写游览方式" />
        </FormItem>
        <FormItem label="线路图" style="margin-bottom: 5px">
          <!-- cultural-tourism-cloud -->
          <Upload :before-upload="beforeUpload"
            :on-success="data => lineParams.images = data.safeUrl"
            :on-remove="() => lineParams.images = ''" accept="image/*"
            :data="{path: 'test'}" name="Filedata"
            :default-file-list="defaultFileList" action="http://file.geeker.com.cn/uploadOSS">
            <Button icon="ios-cloud-upload-outline">上传线路图</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="linePop = false">取消</Button>
        <Button type="primary" :loading="linePopLoading" @click="saveGuidedTourRoute">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import {
  getGuidedTourResourceSelect,
  getTourGuide,
  updatePosition,
  getGuidedTourRoutes,
  getGuidedTourRouteResource,
  saveGuidedTourRoute,
  deleteGuidedTourRoute,
  saveGuidedTourRouteResource
} from "@service/tool";
import { exportExcel } from "@util/comm"
import CONFIG from "@/util/config";
import BaseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
// @ts-ignore
import icon_scenicPt from "@assets/image/travel.png";
// @ts-ignore
import icon_toilet from "@assets/image/wc.png";
// @ts-ignore
import icon_park from "@assets/image/stopCar.png";

let icon_default = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png';
let icon_fuzhudian = '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png';
let map: any = null;

@Component({
  components: {
    BaseTable,
    dropCode
  }
})
export default class Setting extends Vue {
  // 当前选项卡
  private currTab: string = "getScenicPt";
  // 经纬度修改弹窗Boolean
  private lonLatPop: boolean = false;
  private lonLatPopLoading: boolean = false;
  // 经纬度修改参数记录
  private lonLatParams: any = { lonLat: "" };
  // 经纬度更新参数对象
  private lonLatUpdate: any = {};
  private ruleValidatelonLat: any = {
    lonLat: [
      {
        trigger: "blur",
        required: true,
        validator: this.validatePosi
      }
    ]
  };
  // 线路添加验证对象
  private ruleValidatelonLine: any = {
    name: [{ trigger: "blur", required: true, message: "填写它" }],
    tourWay: [{ trigger: "blur", required: true, message: "填写它" }]
  };
  private validatePosi(rule: any, value: any, callback: Function) {
    if (this.lonLatParams.lonLat) {
      if (this.validateLonLat(this.lonLatParams.lonLat) === false) {
        return callback(new Error("坐标不合法"));
      } else {
        return callback();
      }
    } else {
      return callback(new Error("请将坐标填写完整"));
    }
  }
  // 验证点116.327911, 39.939229 是否合法
  private validateLonLat(posi: string): boolean {
    let pass = false;
    let regLong = /^-?(\d{1}|([1-9]\d{1,2}))(\.\d{1,6})?$/;
    let regLat = /^-?(\d{1}|([1-9]\d{1}))(\.\d{1,6})?$/;

    if (posi.indexOf(",") === -1) {
      pass = false;
    } else {
      let ps = posi.split(",");
      pass = regLong.test(ps[0].trim()) && regLat.test(ps[1].trim());
    }
    return pass;
  }
  private tableConfig_scenicpt = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData_scenicpt = <any>{
    headList: [
      {
        title: "景点名称",
        key: "name",
        align: "left"
      },
      {
        title: "经纬度",
        align: "center",
        slot: "position"
      },
      {
        title: "语音",
        align: "center",
        slot: "audio"
      },
      {
        title: "简介",
        align: "center",
        slot: "summary"
      },
      {
        title: "操作",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  private tableConfig_toilet = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData_toilet = <any>{
    headList: [
      {
        title: "厕所名称",
        key: "name",
        align: "left"
      },
      {
        title: "经纬度",
        align: "center",
        slot: "position"
      },
      {
        title: "操作",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  private tableConfig_park = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData_park = <any>{
    headList: [
      {
        title: "停车场名称",
        key: "name",
        align: "left"
      },
      {
        title: "经纬度",
        align: "center",
        slot: "position"
      },
      {
        title: "操作",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  private tableConfig_restaurant = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData_restaurant = <any>{
    headList: [
      {
        title: "餐厅名称",
        key: "name",
        align: "left"
      },
      {
        title: "经纬度",
        align: "center",
        slot: "position"
      },
      {
        title: "操作",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 页面初始化S ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓**/
  /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 页面初始化S ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓**/
  // 导览id
  private id: any = undefined;
  created() {
    this.id = this.$route.query.id;
  }
  mounted() {
    this.getTourGuide();
    this.getScenicPt();
    this.getToilet();
    this.getPark();
    this.getGuidedTourRoutesInit();
    this.$dragging.$on('dragend', this.limit(this.updatePolyLine, 300))
  }
  // 简单节流
  private limit(fn: Function, time: number): any {
    let t: number | undefined;
    return (e:Event) => {
      if (!t) {
        fn();
        t = setTimeout(() => {
          t = undefined;
        }, time)
      };
    }
  }
  // 导游导览数据
  private guideData: any = null
  // 获取导览数据
  private getTourGuide() {
    getTourGuide({ id: this.id }).then((res: any) => {
      if (res.code === 0) {
        this.initMap(res.data)
        this.guideData = res.data
      };
    });
  }
  /**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 页面初始化E ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑**/
  /**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 页面初始化E ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑**/
  // tab切换，加载对应覆盖物
  @Watch('currTab')
  wCurrTab(val?: string) {
    if (map) {
      // tab切换直接清楚所有覆盖物，地图只展示当前tab的数据
      map.clearMap()
      // 清除图层
      map.getLayers().forEach((layer: any) => {
        if ((layer.B || layer.He).isLineImageLayer) {
          layer.setMap(null)
        }
      })
      if (this.currTab === 'getScenicPt') {
        this.addScenicPointMarker()
      } else if (this.currTab === 'getToilet') {
        this.addToiletMarker()
      } else if (this.currTab === 'getPark') {
        this.addParkMarker()
      } else if (this.currTab === 'getLine') {
        this.addLineMarker()
      }
    } 
    // 第一次页面加载完成后的执行，可能地图实例不存在
    else {
      this.todoListOnMap.push(this.wCurrTab)
    }
  }
  // tab切换，加载对应覆盖物
  @Watch('currLineId')
  wCurrLineId(val?: string) {
    this.wCurrTab()
    // 重置插点状态
    this.insertHandle(-1, true)
  }
  // 线路上修改经纬度
  private mdPosition(pt: any) {
    pt.red = !this.validateLonLat(pt.position)
    if (pt.red) {
      this.$Message.error('经纬度不合法！')
    } else {
      let arr = pt.position.split(',')
      pt.longitude = arr[0].trim()
      pt.latitude = arr[1].trim()
      this.updatePolyLine()
      this.updateSingleMarker(pt, 1)
    }
  }
  // 添加景点覆盖物
  private addScenicPointMarker () {
    let marker = this.tableData_scenicpt.bodyList.map((pt:any) => this.createMarker(pt, icon_scenicPt))
    map.add(marker)
    map.setFitView(marker)
  }
  // 添加厕所覆盖物
  private addToiletMarker () {
    let marker = this.tableData_toilet.bodyList.map((pt:any) => this.createMarker(pt, icon_toilet))
    map.add(marker)
    map.setFitView(marker)
  }
  // 添加停车场覆盖物
  private addParkMarker () {
    let marker = this.tableData_park.bodyList.map((pt:any) => this.createMarker(pt, icon_park))
    map.add(marker)
    map.setFitView(marker)
  }
  // 添加线路覆盖物
  private addLineMarker (clearAllOverlay = false) {
    // i清楚覆盖物
    if (clearAllOverlay) map.clearMap();
    // 清除图层
    map.getLayers().forEach((layer: any) => {
      if ((layer.B || layer.He).isLineImageLayer) {
        layer.setMap(null)
      }
    })
    if (this.currLineId) {
      // 加线
      let currLine = this.lines.find((line: any) => line.id == this.currLineId)
      let points = currLine.points
      this.currPolyLine = this.createPolyLine(points.map((pt: any) => [pt.longitude, pt.latitude]))
      this.currPolyLine.setMap(map)

      // 加marker点
      let marker = points.map((pt:any) => {
        let icon = icon_default
        if (pt.resourceType === 'CONTENT_TYPE_SCENIC_SPOTS') {
          icon = icon_scenicPt
        } else if (pt.resourceType === 'CONTENT_TYPE_TOILET') {
          icon = icon_toilet
        } else if (pt.resourceType === 'CONTENT_TYPE_PARKING') {
          icon = icon_park
        } else if (pt.resourceType === 'CONTENT_TYPE_GUIDED_TOUR_ROUTE') {
          icon = icon_fuzhudian
        }
        return this.createMarker(pt, icon, this.dragendFn)
      })
      map.add(marker)
      map.setFitView(marker)

      // 线路图覆盖物
      if (currLine.images) {
        let data = this.guideData
        let imageLayer = new AMap.ImageLayer({
          url: currLine.images,
          bounds: new AMap.Bounds(
            [data.longitudeBottomLeft, data.latitudeBottomLeft],
            [data.longitudeTopRight, data.latitudeTopRight]
          ),
          zooms: [data.zoomsMin, data.zoomsMax],
          map,
          isLineImageLayer: true
        });
      }
    }
  }
  // 更新线路覆盖物
  private updatePolyLine() {
    if (this.currLineId) {
      let points = this.lines.find((line: any) => line.id == this.currLineId).points
      this.currPolyLine.setPath(points.map((pt: any) => [pt.longitude, pt.latitude]))
    }
  }
  // 更新marker覆盖物
  private updateSingleMarker(pt: any, type: number) {
    let marker = map.getAllOverlays('marker').find((marker: any) => ( (marker.B.myKey || marker.He.myKey) === pt.key ) )
    
    if (marker) {
      // 更新位置
      if (type === 1) {
        marker.setPosition(new AMap.LngLat(pt.longitude, pt.latitude))
      }
      // 移除marker
      else if ( type === 0){
        marker.setMap(null)
      }
    }
  }
  /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 线路S ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓**/
  /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 线路S ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓**/
  // 添加修改线路弹窗
  private linePop: boolean = false;
  private lineParams: any = { name: "", tourWay: "" };
  private linePopLoading: boolean = false;
  // 当前线路id
  private currLineId: string | undefined = "";
  // 线路回显时候图片
  private defaultFileList: any[] = [];
  // 线路数据
  private lines: any[] = [];
  // 插辅助点思路：开关+索引，每次插入后更新索引，实现连续插点
  // 插入辅助点开关
  private onInsert: boolean = false;
  // 插入辅助点的当前索引
  private insertIndex: number = -1;
  // 当前绘制的线实例
  private currPolyLine: any = null
  // 点击开启线路编辑弹窗
  private clickHandleLine(type: number) {
    this.linePop = true;
    // 添加
    if (type === 0) {
      this.lineParams = { name: "", tourWay: "", images: "" };
      this.defaultFileList = [];
    }
    // 修改
    else {
      let data = this.lines.find((line: any) => line.id == this.currLineId);
      this.lineParams = {
        name: data.name,
        tourWay: data.tourWay,
        images: data.images,
        id: data.id
      };
      let name = /\/([^\/]+\.[a-zA-Z]+$)/.exec(data.images);
      this.defaultFileList = data.images ? [
        { name: name ? name[1] : "未知名", url: data.images }
      ] : [];
    }
  }
  // 上传前判断数量是否超出
  private beforeUpload() {
    if (this.lineParams.images) {
      this.$Message.info("只能传一张！");
      return false;
    } else {
      return true;
    }
  }
  // 删除线路
  private deleteLine() {
    let data = this.lines.find((line: any) => line.id == this.currLineId);
    if (data) {
      this.$Modal.confirm({
        title: "系统提示",
        content: `确认是否删除${data.name}？`,
        onOk: () => {
          deleteGuidedTourRoute({ ids: data.id }).then((res: any) => {
            if (res.code === 0) {
              this.getGuidedTourRoutesInit(true);
              this.$Message.success("删除成功！");
            }
          });
        }
      });
    }
  }
  // 保存添加线路
  private saveGuidedTourRoute() {
    (this.$refs.linePop as any).validate((valid: any) => {
      if (valid) {
        this.linePopLoading = true;
        saveGuidedTourRoute(Object.assign({ tourId: this.id }, this.lineParams))
          .then((res: any) => {
            if (res.code === 0) {
              this.$Message.success(
                `${this.lineParams.id ? "修改" : "添加"}成功！`
              );
              this.linePop = false;
              this.getGuidedTourRoutesInit(true);
            }
          })
          .finally(() => (this.linePopLoading = false));
      } else {
        this.$Message.info("请完善信息");
      }
    });
  }
  // 获取线路数据
  private getGuidedTourRoutesInit(addMarker = false) {
    this.getGuidedTourRoutes().then((list: any[] | undefined) => {
      if (list && list.length) {
        list.forEach((el: any) => {
          el.points = [];
          this.getGuidedTourRouteResource(el.id).then(
            (pt: any[] | undefined) => {
              if (pt) {
                el.points = pt;
                // 添加线路后，线路子点回来之前已经执行过this.wCurrTab()了，所以这里加个条件性再执行
                if (addMarker && el.id == this.currLineId) this.wCurrTab();
              }
            }
          );
          // dom更新问题避免
          el.key = el.id + Math.random()
        });
        this.currLineId = String(list[0].id);
        this.lines = list;
      } else {
        this.currLineId = ''
        this.lines = []
        // 清除覆盖物
        this.wCurrLineId()
      }
    });
  }
  // 获取线路列表s
  private getGuidedTourRoutes(): Promise<any> {
    return getGuidedTourRoutes({ tourId: this.id }).then((res: any) => {
      if (res.code === 0) {
        return res.datas;
      }
    });
  }
  // 获取线路资源点列表
  private getGuidedTourRouteResource(routeId: number): Promise<any> {
    return getGuidedTourRouteResource({ enablePage: false, routeId }).then(
      (res: any) => {
        if (res.code === 0) {
          res.datas.forEach((pt: any) => {
            pt.position = pt.longitude + "," + pt.latitude;
            pt.key = pt.resourceType + "_" + (pt.resourceId || Math.random());
            pt.red = !this.validateLonLat(pt.position)
            pt.playTime = pt.playTime || 0;
            if (pt.resourceType === 'CONTENT_TYPE_GUIDED_TOUR_ROUTE') {
              pt.name = '辅助点'
            }
          });
          return res.datas;
        }
      }
    );
  }
  // 插入辅助点点击
  private insertHandle(i: number, isCurrItemOnInsert: boolean) {
    if (isCurrItemOnInsert) {
      this.onInsert = false;
      this.insertIndex = -1;
    } else {
      this.onInsert = true;
      this.insertIndex = i;
    }
  }
  // 保存
  private saveGuidedTourRouteResource() {
    this.$Modal.confirm({
      title: '系统提示',
      content: '是否确认提交保存？',
      onOk: () => {
        if (this.currLineId) {
          let points = this.lines.find((line: any) => line.id == this.currLineId).points
          let tip = ''
          let resources: any = []
          let nopass = points.some((pt: any) => {
            let p1 = pt.resourceType !== 'CONTENT_TYPE_GUIDED_TOUR_ROUTE' && !pt.playTime
            let p2 = !this.validateLonLat(pt.position)
            if (p1) tip = '非辅助点必填游玩时长！';
            if (p2) tip = '存在点经纬度不合法！';
            resources.push({
              playTime: pt.playTime,
              resourceType: pt.resourceType,
              longitude: pt.longitude,
              latitude: pt.latitude,
              resourceId: pt.resourceType !== 'CONTENT_TYPE_GUIDED_TOUR_ROUTE' ? pt.resourceId : ''
            })
            return p1 || p2
          })
          if (nopass) {
            this.$Message.error(tip)
          } else {
            saveGuidedTourRouteResource({
              routeId: this.currLineId,
              resources
            }).then((res: any) => {
              if (res.code === 0) {
                this.$Message.success('保存成功！')
              }
            })
          }
        }
      }
    })
  }
  /**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 线路E ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑**/
  /**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 线路E ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑**/
  // 更新坐标
  private updatePosition() {
    (this.$refs.lonLatPop as any).validate((valid: any) => {
      if (valid) {
        this.lonLatPopLoading = true;
        let lonlat = this.lonLatParams.lonLat.split(",");
        updatePosition(
          Object.assign(
            { longitude: lonlat[0].trim(), latitude: lonlat[1].trim() },
            this.lonLatUpdate
          )
        )
          .then((res: any) => {
            if (res.code === 0) {
              this.$Message.success("保存成功！");
              if (this[this.currTab]) this[this.currTab]({});
            }
          })
          .finally(() => {
            this.lonLatPopLoading = false;
            this.lonLatPop = false;
          });
      } else {
        this.$Message.info("请将表单信息填写完整！");
      }
    });
  }
  // 播放audio
  private audioDom: HTMLAudioElement = document.createElement("audio");
  private playAudio(item: any) {
    let currItem: any;
    this.tableData_scenicpt.bodyList.forEach((d:any) => {
      if (d.resourceId === item.resourceId) {
        currItem = d
      } else {
        d.playing = false
      };
    });
    currItem.playing = !currItem.playing;
    if (currItem.playing) {
      this.audioDom.src = currItem.audio;
      this.audioDom.onloadeddata = () => this.audioDom.play();
      this.audioDom.onended = () => (currItem.playing = false);
    } else {
      this.audioDom.pause();
      this.audioDom.src = "";
    }
  }
  // 获取景点资源列表
  private getScenicPt(page: any = this.tableConfig_scenicpt.page) {
    let params: any = {
      tourId: this.id,
      resourceType: "CONTENT_TYPE_SCENIC_SPOTS"
    };
    params.currPage = page.currPage;
    params.pageSize = page.pageSize;
    getGuidedTourResourceSelect(params).then((res: any) => {
      if (res.code === 0) {
        res.datas.forEach((el: any) => (el.playing = false));
        this.tableData_scenicpt.bodyList = res.datas;
        this.tableConfig_scenicpt.page = res.page;
        if (this.currTab === 'getScenicPt') this.wCurrTab()
      }
    });
  }
  // 获取厕所资源列表
  private getToilet(page: any = this.tableConfig_toilet.page) {
    let params: any = { tourId: this.id, resourceType: "CONTENT_TYPE_TOILET" };
    params.currPage = page.currPage;
    params.pageSize = page.pageSize;
    getGuidedTourResourceSelect(params).then((res: any) => {
      if (res.code === 0) {
        this.tableData_toilet.bodyList = res.datas;
        this.tableConfig_toilet.page = res.page;
        if (this.currTab === 'getToilet') this.wCurrTab()
      }
    });
  }
  // 获取停车资源列表
  private getPark(page: any = this.tableConfig_park.page) {
    let params: any = { tourId: this.id, resourceType: "CONTENT_TYPE_PARKING" };
    params.currPage = page.currPage;
    params.pageSize = page.pageSize;
    getGuidedTourResourceSelect(params).then((res: any) => {
      if (res.code === 0) {
        this.tableData_park.bodyList = res.datas;
        this.tableConfig_park.page = res.page;
        if (this.currTab === 'getPark') this.wCurrTab()
      }
    });
  }
  // 获取餐厅列表
  private getRestaurant(page: any = this.tableConfig_restaurant.page) {
    let params: any = {
      tourId: this.id,
      resourceType: "CONTENT_TYPE_RESTAURANT"
    };
    params.currPage = page.currPage;
    params.pageSize = page.pageSize;
    getGuidedTourResourceSelect(params).then((res: any) => {
      if (res.code === 0) {
        this.tableData_restaurant.bodyList = res.datas;
        this.tableConfig_restaurant.page = res.page;
        if (this.currTab === 'getRestaurant') this.wCurrTab()
      }
    });
  }
  // 下载景点二维码
  private downLoad() {
    exportExcel(
      `${CONFIG.defaultUrl}/res/site/guidedTourResource/download?token=${this.$cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)}&tourId=${this.id}`
    )
  }
  /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 左地图S ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓**/
  /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 左地图S ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓**/
  // 地图待办事项（地图还没实例化，可能已经存在地图操作需求）
  private todoListOnMap: Function[] = []
  // 初始化地图
  private initMap(data: any) {
    let option: any = {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: data.zoom || 11, //初始化地图层级
      zooms: [data.zoomsMin || 3, data.zoomsMax || 18], //初始化地图层级
      center: [data.longitude || data.regionLongitude || 116.397428, data.latitude || data.regionLatitude || 39.90923] //初始化地图中心点
    };
    let mapLayer: any = null;
    // 首先瓦片包
    if (data.tilesMap) {
      mapLayer = new AMap.TileLayer.Flexible({
        cacheSize: 30,
        opacity: 0.9,
        zooms: [data.zoomsMin, data.zoomsMax],
        createTile: function(
          x: number,
          y: number,
          z: number,
          success: Function,
          fail: Function
        ) {
          let img = document.createElement("img");
          img.onload = function() {
            success(img);
          };
          // img.crossOrigin = "anonymous";//3D 的时候添加，同时图片要有跨域头
          img.onerror = function() {
            fail();
          };
          // 后头根据瓦片图地址来改
          if (z < data.zoomsMin || z > data.zoomsMax) {
            img.src = `${data.tilesMap}blank.png`;
          } else {
            img.src = `${data.tilesMap}${z}/${x}_${y}.png`;
          }
          // img.src = `${data.tilesMap}${z}/${x}_${y}.png`;
        }
      });
    }
    // 其次 详细图 手绘图
    else if (data.detailMap || data.handPaintedMap) {
      let url = data.detailMap || data.handPaintedMap;
      let imageLayer = new AMap.ImageLayer({
        url,
        bounds: new AMap.Bounds(
          [data.longitudeBottomLeft, data.latitudeBottomLeft],
          [data.longitudeTopRight, data.latitudeTopRight]
        ),
        zooms: [data.zoomsMin, data.zoomsMax]
      });
      option.layers = [new AMap.TileLayer(), imageLayer];
    }

    map = new AMap.Map(this.$refs.map, option);
    if (data.tilesMap) mapLayer.setMap(map);
    map.on("click", this.mapClickHandle);
    // 执行待办事项
    while(this.todoListOnMap[0]) {
      this.todoListOnMap[0]()
      this.todoListOnMap.splice(0, 1)
    }
  }
  // 地图点击
  private mapClickHandle(e: any) {
    ////////////线路S
    if (this.currTab === 'getLine') {
      // 线路插入辅助点
      if (this.onInsert) {
        let points = this.lines.find((line: any) => line.id == this.currLineId).points
        this.insertIndex++;
        let pt = {
          name: '辅助点',
          key: Date.now(),
          playTime: 0,
          resourceType: 'CONTENT_TYPE_GUIDED_TOUR_ROUTE',
          longitude: e.lnglat.getLng(),
          latitude: e.lnglat.getLat(),
          position: e.lnglat.getLng() + ',' + e.lnglat.getLat()
        }
        points.splice(this.insertIndex, 0, pt)
        // 这里就单独手动更新下线和marker了，不调用上面的方法(性能)
        this.currPolyLine.setPath(points.map((pt: any) => [pt.longitude, pt.latitude]));
        map.add(this.createMarker(pt, icon_fuzhudian, this.dragendFn))
      }
    }
    ////////////线路E
  }
  // marker拖拽完成事件
  private dragendFn(e:any) {
    let points = this.lines.find((line: any) => line.id == this.currLineId).points
    let pt = points.find((pt:any) => pt.key === (e.target.B || e.target.He).myKey)
    if (pt) {
      pt.longitude = e.target.getPosition().lng
      pt.latitude = e.target.getPosition().lat
      pt.position = pt.longitude + "," + pt.latitude;
      // 更新坐标
      if (pt.resourceId) {
        updatePosition({ 
          longitude: pt.longitude, 
          latitude: pt.latitude, 
          resourceId: pt.resourceId, 
          resourceType: pt.resourceType
        })
        .then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("坐标更新成功！")
          }
        })
      }
    }
    this.updatePolyLine()
  }
  // 创建marker 传递dragendFn就表面要能拖拽
  private createMarker(pt: any, icon: any, dragendFn?: Function): any {
    let { longitude, latitude, name, key } = pt
    let markerContent = document.createElement("div");
    // 点标记中的图标
    let markerImg = document.createElement("img");
    markerImg.style.width = "25px";
    markerImg.style.height = "34px";
    markerImg.src = icon;
    markerContent.appendChild(markerImg);
    // 点标记中的文本
    let markerSpan = document.createElement("span");
    markerSpan.style.width = "130px";
    markerSpan.style.position = "absolute";
    markerSpan.style.top = "-16px";
    markerSpan.style.left = "20px";
    let markerSpanChild = document.createElement("span");
    markerSpanChild.style.color = "#fff";
    markerSpanChild.style.padding = "4px 10px";
    markerSpanChild.style.backgroundColor = "#25A5F7";
    markerSpanChild.style.borderRadius = "3px";
    let txt = (name || '').slice(0,7);
    markerSpanChild.innerHTML = (name || '').length > 7 ? txt + '...' : txt;
    markerSpanChild.title = (name || '');
    markerSpan.appendChild(markerSpanChild);
    markerContent.appendChild(markerSpan);

    let marker = new AMap.Marker({
      position: [longitude, latitude],
      offset: new AMap.Pixel(-12.5, -30),
      content: markerContent,
      myKey: key,
      draggable: Boolean(dragendFn)
    })
    if (dragendFn) marker.on('dragend', dragendFn);
    return marker
  }
  // 绘制线路
  private createPolyLine(lineArr: [number, number][]): any {
    return new AMap.Polyline({
      path: lineArr,            // 设置线覆盖物路径
      strokeColor: '#3366FF',   // 线颜色
      strokeOpacity: 1,         // 线透明度
      strokeWeight: 8,          // 线宽
      strokeStyle: 'solid',     // 线样式
      strokeDasharray: [10, 5], // 补充线样式
      geodesic: true,            // 绘制大地线
      showDir: true
    });
  }
  /**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 左地图E ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑**/
  /**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 左地图E ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑**/
  
  // 释放内存
  beforeDestroy() {
    map.destroy();
    map = null;
    this.audioDom.src = "";
  }
}
</script>

<style lang='scss' scoped>
.bgred {
  background-color: red;
}
.nodata {
  position: absolute;
  z-index: -1;
  width: 100%;
  text-align: center;
  left: 0;
  top: 8px;
}
.nodata2 {
  text-align: center;
  line-height: 50px;
}
.mr5 {
  margin: 0 5px;
}
.control {
  color: $theme;
  cursor: pointer;
}
.icon-audio {
  &:hover {
    // color: #2196f3;
    cursor: pointer;
  }
  &.play {
    color: #2196f3;
  }
}
.container {
  display: flex;
  padding: 20px;
  .map {
    width: 50%;
    min-height: calc(100vh - 187px);
    box-shadow: 0 0 10px #ddd;
  }
  .tabs {
    width: calc(50% - 20px);
    margin-left: 20px;
    .point-list {
      max-height: 555px;
      overflow-y: scroll;
    }
    .line {
      display: flex;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #eee;
      & > div {
        flex: 1;
        border-right: 1px solid #eee;
        line-height: 20px;
        &:first-child {
          flex: auto;
          width: 200px;
          padding: 10px 15px;
          text-align: left;
          border-left: 1px solid #eee;
        }
      }
      .input {
        width: 50px;
      }
    }
    .title {
      border-top: 1px solid #eee;
      border-left: 1px solid #eee;
      font-size: 14px;
      font-weight: bold;
      div {
        &:first-child {
          border-left: 0;
        }
      }
    }
  }
}
</style>
