<template>
    <Modal
            title="用户诚信等级"
            :value="show_in"
            :footer-hide="true"
            @on-cancel="cancel">
        <Table border :columns="columns1" :data="bodyList">
            <template slot="point" slot-scope="{row,index}">
                {{row.minScore}}-{{row.maxScore}}
            </template>
        </Table>
    </Modal>
</template>

<script lang='ts'>
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {getLevelRuleList} from "@service/member";
    @Component({components: {}})
    export default class CreditLevel extends Vue {
        @Prop({default: false}) private show!:boolean;
        private show_in: boolean = this.show;
        private columns1:Array<any> = [
            {
                title: '等级',
                key: 'level',
                align:'center'
            },
            {
                title: '名称',
                key: 'name',
                align:'center'
            },
            {
                title: '分值',
                key: 'point',
                slot:'point',
                align:'center'
            }
        ]
        private bodyList:Array<any> = [];
        @Watch('show')
        wShow(n: boolean) {
          this.show_in = n
        }
        //等级规则列表
        private getLevelRuleList() {
            let _this=this;
            getLevelRuleList().then((res:any)=>{
                _this.bodyList=res.datas as [];
            })
        }
        created() {
            this.getLevelRuleList();
        }
        cancel () {
            this.$emit('close')
        }
    }
</script>

<style lang='scss' scoped>
</style>
