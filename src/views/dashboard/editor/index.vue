<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom: 1.5em"
        >
          <el-col
            :span="8"
            :offset="2"
          >
            <el-radio-group
              v-model="etatLibelle"
              size="small"
              @change="etatChange"
            >
              <el-radio-button label="Initiés"/>
              <el-radio-button label="Engagés"/>
              <el-radio-button label="Imputés"/>
              <el-radio-button label="Apurés"/>
              <el-radio-button label="Clôturés"/>
            </el-radio-group>
          </el-col>
        </el-row>
        <PreEngagements
          :etat="etat"
          :title="title"
        />
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
  private etat = 'INIT'
  private etatLibelle = 'Initiés'
  private title = 'Pré engagements initiés'
  private etatsLibelle: Record<string, any> = {
    'Initiés': {code: 'INIT', title: 'Pré engagements initiés'},
    'Engagés': {code: 'PEG', title: 'Liste des engagements'},
    'Imputés': {code: 'IMP', title: 'Engagements imputés'},
    'Apurés': {code: 'REA', title: 'Engagements apurés'},
    'Clôturés': {code: 'CLOT', title: 'Pré engagements clôturés'}
  }

  created() {
  }

  get name() {
    return UserModule.name
  }

  get avatar() {
    return UserModule.avatar
  }

  get roles() {
    return UserModule.roles
  }

  private etatChange() {
    this.etat = this.etatsLibelle[this.etatLibelle].code
    this.title = this.etatsLibelle[this.etatLibelle].title
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
