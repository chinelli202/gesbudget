<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <PreEngagements />
      </div>
    </div>
    <div />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import PreEngagements from './components/preengagements'

@Component({
  name: 'DashboardEditor',
  components: {
    PreEngagements
  }
})
export default class extends Vue {
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
.dashboard-editor-container {
  background-color: #ffffff;
  // min-height: 100vh;
  padding: 0px 30px 0px;

  .introduction {
    margin: 0;
    text-align: right;

    .display_name {
      font-size: 38px;
      line-height: 38px;
      color: #212121;
    }
  }

  .app-container {
    padding: 10px 0px;
  }

  .info-roles {
    font-size: 12px;
    font-weight: 700;
    color: #333;
    display: block;
  }
}
</style>
