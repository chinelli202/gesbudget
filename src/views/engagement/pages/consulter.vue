<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <el-row :gutter="10" style="margin-bottom: 1em">
          <el-col
            :span="3" 
            :offset="3"
          >
            <el-select v-model="domain"
              placeholder="Domaine"
              @change="domainChanged"
            >
              <el-option
                key="Fonctionnement"
                label="Fonctionnement"
                value="Fonctionnement"
              />
              <el-option
                key="Mandat"
                label="Mandat"
                value="Mandat"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-cascader
              v-model="lignesBudgetaire"
              style="width: 28.4vw"
              placeholder="Ligne budgétaire"
              :options="chapitresOptions"
              :props="{ multiple: true, expandTrigger: 'hover'}"
              collapse-tags
              clearable
              @change="ligneChanged"
              >
            </el-cascader>
          </el-col>
          <el-col :span="4">
            <el-select v-model="etat" style="width: 14vw" multiple placeholder="Etat de l'engagement">
              <el-option
                v-for="item in etatSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; margin-right: 3em; color: rgb(132, 146, 166); font-size: 13px;">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="5">
            <el-input
              width="18vw"
              v-model="libelle"
              placeholder="Rechercher par libelle">  
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" :offset="6">
            <el-select v-model="actionType" style="width: 14vw" multiple placeholder="Engagements ayant été...">
              <el-option
                v-for="item in statutSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="etat" style="width: 14vw" multiple placeholder="Choisir un utilisateur">
              <el-option
                v-for="item in etatSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="statut" style="width: 14vw" multiple placeholder="Statut de l'engagement">
              <el-option
                v-for="item in statutSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; margin-right: 3em; color: rgb(132, 146, 166); font-size: 13px;">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="monthrange"
              type="monthrange"
              align="right"
              unlink-panels
              range-separator="à"
              start-placeholder="Mois de début"
              end-placeholder="Mois de fin"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
        </el-row>
        
        <EngagementsList
          :etat="etatString"
          :showTitle = "false"
          :lignes = lignes
          :rubriques = rubriques
          :chapitres = chapitres
          :tableHeight="'72vh'"
          :displayCreateButton="false"
        />
      </div>
    </div>
    <div />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import EngagementsList from '../components/engagementslist'

@Component({
  name: 'DashboardEditor',
  components: {
    EngagementsList
  }
})
export default class extends Vue {
  private etat: string[] = []
  private statut: string[] = []
  private libelle = ''
  private title = 'Consulter les engagements'
  private actionType = ''
  private monthrange = []
  private lignesBudgetaire = []
  private chapitres = ''
  private rubriques = ''
  private lignes = ''
  private domain = 'Fonctionnement'
  private chapitresOptions: any = AppModule.budgetStructure.fonctionnement

  created() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private ligneChanged() {
    console.log("ligneBudgetaire ", this.lignesBudgetaire)
    this.chapitres = [...new Set(this.lignesBudgetaire.map((el) => {
      return el[0]
    }))].join(',')

    this.rubriques = [...new Set(this.lignesBudgetaire.map((el) => {
      return el[1]
    }))].join(',')

    this.lignes = [...new Set(this.lignesBudgetaire.map((el) => {
      return el[2]
    }))].join(',')
    console.log("detail ligneBudgetaire ", this.chapitres, this.rubriques, this.lignes)
  }

  private domainChanged() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
    console.log("New domain ", this.domain)
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

  get etatString() {
    return this.etat.join(',')
  }

  private etatSelect = [{
        value: 'INIT',
        label: 'Initiés'
      },
      {
        value: 'PEG',
        label: 'Engagés'
      },
      {
        value: 'IMP',
        label: 'Imputés'
      },
      {
        value: 'APUR',
        label: 'Apurés'
      },
      {
        value: 'CLOT',
        label: 'Clôturés'
      }]

  private statutSelect = [{
        value: 'SAISI',
        label: 'Saisi'
      },
      {
        value: 'VALIDP',
        label: 'Validés au 1er niveau'
      },
      {
        value: 'VALIDS',
        label: 'Validés au 2nd niveau'
      },
      {
        value: 'VALIDF',
        label: 'Validés au niveau final'
      }]
  
  pickerOptions = {
    disabledDate(time: any) {
      return time.getTime() > Date.now();
    },
    shortcuts: [{
      text: 'Aujourd\'hui',
      onClick(picker: any) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: 'Hier',
      onClick(picker: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: 'Il y a une semaine',
      onClick(picker: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
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

  .info-container {
    position: relative;
    margin-left: 190px;
    height: 150px;
    line-height: 200px;

    .display_name {
      font-size: 48px;
      line-height: 48px;
      color: #212121;
      position: absolute;
      top: 25px;
    }
  }
}
</style>
