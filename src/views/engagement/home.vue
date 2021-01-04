<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <h1> Tableau de bord </h1>
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
                />
              </el-main>
            </el-card>
            <br>
          </div>
          
        </div>
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
                  />
                </el-main>
              </el-card>
              <br>
              <br>
            </div>
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
import { getUsers } from '@/api/users'
import EngagementsList from './components/engagementslist'

@Component({
  name: 'Home',
  components: {
    EngagementsList
  }
})

export default class Home extends Vue {
  private permissions = UserModule.permissions
  private upperEngagementPermissions: any[] = []
  private writingEngagementPermissions: any[] = []

  created() {
    let engagementPermissions = UserModule.permissions.filter((value) => {
      console.log('value = >'+ value.code.split('_')[0].trim()+ '<')
      return value.code.split('_')[0].trim() === 'ENG'
    })

    this.upperEngagementPermissions = engagementPermissions.filter((value) => {
      console.log('value = >'+ value.code.split('_')[2].trim()+ '<')
      return value.code.split('_')[2].trim() === 'VALIDP' || value.code.split('_')[2].trim() === 'VALIDS' || value.code.split('_')[2].trim() === 'VALIDF'
    })

    this.writingEngagementPermissions = engagementPermissions.filter((value) => {
      return value.code.split('_')[2].trim() === 'SAISI'
    })
  }

  private hasUpperPermissions() {
    console.log('hasOnlySaisiPermissions ', this.upperEngagementPermissions)
    return this.upperEngagementPermissions.length > 0
  }

  private hasWritingPermissions() {
    console.log('writingEngagementPermissions ', this.writingEngagementPermissions)
    return this.writingEngagementPermissions.length > 0
  }
}
</script>

<style lang="scss" scoped>

</style>
