<template>
    <div class="member">
        <!-- 基础展示部分 -->
        <div class="member-view" v-if="!showSetting">
            <div class="member-header">
                <h3>用户诚信</h3>
                <p>建立用户诚信体系，倡导公众信用文化，畅享信用生活</p>
            </div>
            <div class="info">
                <p>1、建立用户诚信体系：对用户的诚信等级、诚信行为进行配置，建立用户诚信体系，倡导公众信用文化，畅享信用生活。</p>
                <p>2、信用等级：引导、激励用户丰富守约行为，提升自己的信用等级，享受信用权益。</p>
                <p>3、信用权益：用户可根据信用等级享受诚信免审、活动诚信优享等福利。</p>
            </div>
            <div class="btns">
                <div v-if="creditStatus===0">
                    <Button class="btn" type="primary" @click="updateSiteConfig(1)">确认开通</Button>
                </div>
                <div v-else-if="creditStatus===1">
                    <Button class="btn" type="primary" @click="changeShowSetting">查看规则</Button>
                    <Button class="btn" type="error" @click="close">关闭</Button>
                </div>
                <div v-else-if="creditStatus===2">
                    <Button class="btn" type="primary" @click="changeShowSetting">查看规则</Button>
                    <Button class="btn" @click="updateSiteConfig(1)">开启</Button>
                </div>
            </div>
        </div>
        <!-- 会员等级配置和任务配置 -->
        <div v-else>
            <MemberSetting/>
        </div>
    </div>
</template>


<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    import MemberSetting from './integrity-setting.vue';
    import {AppModule} from "@store/modules/app";
    import {ModalConfig} from "iview/types";
    import {getSiteUserInfo, saveCloudSite} from "@service/common"

    @Component({
        components: {
            MemberSetting
        }
    })
    export default class MemberSystem extends Vue {
        // 是否开启了用户诚信
        private creditStatus = '';
        // 是否展示诚信等级配置和诚信行为；
        showSetting = false;

        getSiteUserInfo() {
            getSiteUserInfo({id: this.$store.state.app.userInfo.siteId}).then((res: any) => {
                if (res.code === 0) {
                    this.creditStatus = res.data.creditStatus;
                    AppModule.setAppSiteInfo(res.data);
                }
            })
        }

        created() {
            this.getLocalSettingData();
            this.getSiteUserInfo();
        }

        /**
         * getLocalSettingData 获取站点的基本配置，判断用户是否开启用户诚信
         */
        getLocalSettingData() {
            // 全局弹窗蒙层
            // AppModule.setAppFixedLoadingStatus(true)
        }

        /**
         * 开启用户诚信
         * @params vipPlayStatus {boolean} 是否开启用户诚信体系
         */
        updateSiteConfig(status: any) {
            let params = {
                id: this.$store.state.app.userInfo.siteId,
                creditStatus: status
            };
            saveCloudSite(params).then((res: any) => {
                if (res.code === 0) {
                    this.$Message.success(status ? `开启用户诚信成功` : `关闭用户诚信成功`)
                    this.getSiteUserInfo();
                }
            })
        }

        // 点击配置规则
        changeShowSetting() {
            AppModule.setAppFixedLoadingStatus(true);
            this.showSetting = !this.showSetting;
            setTimeout(() => {
                AppModule.setAppFixedLoadingStatus(false);
            }, 300)
        }

        /**
         * close 关闭会员体系
         */
        close() {
            this.closeModalStep1()
        }

        // 关闭会员体系弹窗1
        closeModalStep1() {
            let config: ModalConfig = {
                title: "操作提示",
                content: `您关闭用户诚信后，平台将无法设置诚信免审、诚信优享权益！`,
                okText: "我再考虑考虑",
                cancelText: "知道了，下一步",
                onCancel: () => {
                    setTimeout(this.closeModalStep2, 400)
                }
            };
            this.$Modal.confirm(config);
        }

        // 关闭会员体系弹窗2
        closeModalStep2() {
            let config: ModalConfig = {
                title: "操作提示",
                content: `您关闭用户诚信后，用户诚信分值和等级将失效不再展示！`,
                okText: "知道了，下一步",
                cancelText: "我再考虑考虑",
                onOk: () => {
                    setTimeout(this.closeModalStep3, 400)
                }
            };
            this.$Modal.confirm(config);
        }

        // 关闭会员体系弹窗3
        closeModalStep3() {
            let config: ModalConfig = {
                title: "操作提示",
                content: `您关闭用户诚信后，会员将无法获得诚信分值`,
                okText: "关关关",
                cancelText: "我再考虑考虑",
                onOk: () => {
                    this.updateSiteConfig(0)
                }
            };
            this.$Modal.confirm(config);
        }
    }
</script>

<style lang='scss' scoped>
    .member-view {
        padding: 15px;
    }

    .member-header {
        padding: 24px;
        background: $grayDark;
        h3 {
            padding-bottom: 12px;
            font-size: 18px;
            color: $font01;
            font-weight: 700;
        }
        p {
            font-size: 14px;
        }
    }

    .info {
        max-width: 900px;
        padding: 12px 0 0 12px;
        font-size: 12px;
        line-height: 28px;
    }

    .btns {
        padding: 24px 12px;
        div {
            padding-bottom: 24px;
        }
        .btn {
            min-width: 80px;
            margin-right: 24px;
        }
    }
</style>
