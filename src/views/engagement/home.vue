<template>
  <div>
    <h1> Livre </h1>

    <div
      v-for="(permission) in permissions"
      :key="permission.code"
    >
      <div v-if="permission.to_perform_on">
        *********
        permission.to_perform_on[1] {{ permission.to_perform_on.split('_')[1] }}
        permission.to_perform_on[2] {{ permission.to_perform_on.split('_')[2] }}
        permission.display_name {{ permission.display_name }}
        <EngagementsList
          :etat="permission.to_perform_on.split('_')[1]"
          :statut="permission.to_perform_on.split('_')[2]"
          :title="permission.display_name"
          :show-title="true"
          :table-height="'72vh'"
          :display-create-button="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
}
</script>

<style lang="scss" scoped>

</style>
