<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <el-row
          type="flex"
          justify="space-between"
          style="margin: 0.5em 0px"
        >
          <el-col :span="13">
            <h1
              style="margin-top: 0px; margin-left: 1em;"
            >
              Tableau de bord
            </h1>
          </el-col>
          <el-col :span="10">
            
          </el-col>
          <el-col
            v-if="canCreateEngagement"
            :span="9"
            :offset="4"
          >
            <create-eng-button
              :inactive="!canCreateEngagement"
              :createEngAction="createEngagement"
            >
            </create-eng-button>
          </el-col>
          <el-col
            v-else
            :span="9"
            :offset="4"
          >
            .
          </el-col>
        </el-row>
        <div v-if="hasUpperPermissions()">
          <div
            v-for="(permission) in upperEngagementPermissions"
            :key="permission.code"
          >
            <div v-if="permission.to_perform_on">
              <!-- *********
              to perform on Etat : {{ permission.to_perform_on }} <strong>{{ permission.to_perform_on.split('_')[0] }}</strong>
              Statut <strong>{{ permission.to_perform_on.split('_')[1] }}</strong>
              permission.display_name {{ permission.display_name }} -->
              <el-card shadow="always">
                <el-main>
                  <EngagementsList
                    :etat="permission.to_perform_on.split('_')[0]"
                    :statut="permission.to_perform_on.split('_')[1]"
                    :title="permission.display_name"
                    :show-title="true"
                    :table-height="'50vh'"
                    :display-create-button="false"
                    :display-export-button="false"
                    :key="permission.code.split('_')[0] + permission.to_perform_on.split('_')[1] + keyForRefresh"
                  />
                </el-main>
              </el-card>
              <br>
              <br>
            </div>
          </div>
        </div>
        <div v-if="hasWritingPermissions()">
          <div
            v-for="(permission) in writingEngagementPermissions"
            :key="permission.code"
          >
            <el-card shadow="always">
              <el-main>
                <EngagementsList
                  :etat="permission.code.split('_')[1]"
                  :statut="'NEW,SAISI'"
                  :title="permission.display_name"
                  :show-title="true"
                  :table-height="'50vh'"
                  :display-create-button="permission.code.split('_')[1] === 'INIT'"
                  :display-export-button="false"
                  :key="permission.code.split('_')[1] + 'NEW,SAISI' + keyForRefresh"
                />
              </el-main>
            </el-card>
            <br>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import { getUsers } from '@/api/users'
import { createEngagement } from '@/api/engagements'
import EngagementsList from '@/views/engagement/components/engagementslist.vue'
import CreateEngButton from '@/views/engagement/components/createengbutton.vue'

@Component({
  name: 'Home',
  components: {
    EngagementsList,
    CreateEngButton
  }
})

export default class Home extends Vue {
  private permissions = UserModule.permissions
  private upperEngagementPermissions: any[] = []
  private writingEngagementPermissions: any[] = []
  private canCreateEngagement = true
  private keyForRefresh = 0

  created() {
    this.canCreateEngagement = UserModule.permissions.filter(item => item.code === PermissionModule.permissionCodes.engagement.INIT.SAISI).length > 0

    let engagementPermissions = UserModule.permissions.filter((value) => {
      return value.code.split('_')[0].trim() === 'ENG'
    })

    this.upperEngagementPermissions = engagementPermissions.filter((value) => {
      return value.code.split('_')[2].trim() === 'VALIDP' || value.code.split('_')[2].trim() === 'VALIDS' || value.code.split('_')[2].trim() === 'VALIDF'
    })

    this.writingEngagementPermissions = engagementPermissions.filter((value) => {
      return value.code.split('_')[2].trim() === 'SAISI'
    })
  }

  private hasUpperPermissions() {
    return this.upperEngagementPermissions.length > 0
  }

  private hasWritingPermissions() {
    return this.writingEngagementPermissions.length > 0
  }

  private createEngagement(engagement: any) {
    console.log('engagement ', engagement)
    createEngagement(engagement).then((response) => {
      const newEngagement = response.data
      ++this.keyForRefresh
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
