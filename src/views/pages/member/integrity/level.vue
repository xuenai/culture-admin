<template>
    <div class="level">
        <!-- 诚信等级 -->
        <div class="tips-panel clearfix">
            <span class="fl title">诚信等级</span>
        </div>
        <Table class="table mt15" border :columns="tableData.headList" :data="tableData.bodyList"  :loading="loading">
            <template slot="score" slot-scope="{row,index}">
                {{row.minScore}}-{{row.maxScore}}
            </template>
        </Table>
        <!-- 诚信规则 -->
        <div class="tips-panel clearfix">
            <span class="fl title">诚信规则</span>
        </div>

        <div class="box pd15" v-html="description">
        </div>

    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import {Ueditor} from "@components/index";
    import {getLevelRuleList,getRuleList} from "@service/member";
    @Component({
        components: {}
    })
    export default class Level extends Vue {
       private loading:boolean = false;
       private tableData:any={
           headList : [
               {
                   title: "等级",
                   key: "level",
                   align: "center",
               },
               {
                   title: "名称",
                   key: "name",
                   align: "center",
               },
               {
                   title: "分值",
                   key: "score",
                   slot:'score',
                   align: "center",
               },
               {
                   title: "等级描述",
                   key: "description",
                   align: "center",
                   width:400
               }
           ],
           bodyList:[]
       };

       //规则列表
        private description:any='';
        getRuleList(){
            let _this=this;
           getRuleList().then((res:any)=>{
               _this.description=res.data.description;
               _this.getLevelRuleList(res.data.id);
           })
       }
       //等级规则列表
        private getLevelRuleList(id:any) {
            let _this=this;
            getLevelRuleList({
                creditRuleId:id
            }).then((res:any)=>{
                _this.tableData.bodyList=res.datas as [];
                _this.loading = false;
            })
        }
        created() {
           this.getRuleList();
        }
    }
</script>

<style lang='scss' scoped>
    .level {
        padding: 0 15px 15px;
    }
    .tips-panel {
        margin-top: 30px;
        background-color: $grayLight;
        padding: 20px;
        .title {
            position: relative;
            padding-left: 10px;
            color: $font01;
            font-weight: 600;
            font-size: 16px;
            &:after {
                position: absolute;
                left: 0;
                top: 4px;
                content: '';
                width: 3px;
                height: 16px;
                border-radius: 1.5px;
                background-color: $theme;
            }
        }
    }
</style>
