<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="introduction">
        <div class="display_name">
          {{ name }}
        </div>
        <span
          v-for="item in roles"
          :key="item"
          class="info-roles"
        >{{ item }}</span>
      </div>
    </div>
    <div>
      <img
        :src="emptyGif"
        class="emptyGif"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'DashboardEditor',
  components: {
  }
})
export default class extends Vue {
  private emptyGif = 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'

  get name() {
    return UserModule.name
  }

  get avatar() {
    return UserModule.avatar
  }

  get roles() {
    return UserModule.roles
  }
}
</script>

<style lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 10px 30px 0px;

  .introduction {
    margin: 0;
    text-align: right;

    .display_name {
      font-size: 38px;
      line-height: 38px;
      color: #212121;
    }
  }

  .info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
}
</style>
