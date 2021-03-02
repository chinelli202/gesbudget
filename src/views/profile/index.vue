<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col
          :span="6"
          :xs="24"
        >
          <user-card :user="user" />
        </el-col>
        <el-col
          :span="18"
          :xs="24"
        >
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- <el-tab-pane
                label="Activity"
                name="activity"
              >
                <activity />
              </el-tab-pane>
              <el-tab-pane
                label="Timeline"
                name="timeline"
              >
                <timeline />
              </el-tab-pane>
              <el-tab-pane
                label="Account"
                name="account"
              >
                <account :user="user" />
              </el-tab-pane> -->
              <el-tab-pane
                :label="$t('profile.tab.passwordchange_label')"
                name="passwordChange"
              >
                <password-change :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import Account from './components/Account.vue'
import Activity from './components/Activity.vue'
import Timeline from './components/Timeline.vue'
import UserCard from './components/UserCard.vue'
import PasswordChange from './components/PasswordChange.vue'

export interface IProfile {
  name: string
  email: string
  roles: string
}

const defaultProfile: IProfile = {
  name: 'Loading...',
  email: 'Loading...',
  roles: 'Loading...'
}

@Component({
  name: 'Profile',
  components: {
    Account,
    Activity,
    Timeline,
    UserCard,
    PasswordChange
  }
})
export default class extends Vue {
  private user = UserModule.loggedUser
  private activeTab = 'passwordChange'

  get roles() {
    return UserModule.roles
  }

  created() {
    this.user['roles'] = UserModule.roles
  }
}
</script>
