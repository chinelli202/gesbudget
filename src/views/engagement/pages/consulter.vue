<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div class="app-container">
        <el-row :gutter="10" style="margin-bottom: 1em">
          <el-col :span="4" :offset="6">
            <el-select
              v-model="operationType"
              style="width: 14vw"
              placeholder="Engagements ayant été..."
              @change="operationTypeChanged"
              clearable
            >
              <el-option
                v-for="item in operationSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="operateurSelect"
              style="width: 14vw"
              multiple
              placeholder="Choisir un utilisateur"
              @change="operationTypeChanged"
            >
              <el-option
                v-for="item in usersList"
                :key="item.matricule"
                :label="item.name"
                :value="item.matricule">
              </el-option>
            </el-select>
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
              v-if="false"
              width="18vw"
              v-model="libelle"
              placeholder="Rechercher par libelle">  
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
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
              filterable
              @change="ligneChanged"
              >
            </el-cascader>
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
              v-if="false"
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
          :statut="statutString"
          :showTitle = "false"
          :lignes = lignes
          :saisisseurs = "operateurs.SAISI"
          :valideursP = "operateurs.VALIDP"
          :valideursS = "operateurs.VALIDS"
          :valideursF = "operateurs.VALIDF"
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
import { getUsers } from '@/api/users'
import EngagementsList from '@/views/engagement/components/engagementslist.vue'

@Component({
  name: 'DashboardEditor',
  components: {
    EngagementsList
  }
})
export default class extends Vue {
  private etat: string[] = []
  private statut: string[] = []
  private operationType: string = ''
  private operateurSelect: string[] = []
  private usersList: string[] = []
  private operateurs: Record<string, any> = {
    SAISI: '',
    VALIDP: '',
    VALIDS: '',
    VALIDF: ''
  }
  private saisisseurs: string[] = []
  private valideursP: string[] = []
  private valideursS: string[] = []
  private valideursF: string[] = []

  private libelle = ''
  private title = 'Consulter les engagements'
  private actionType = ''
  private monthrange = []
  private lignesBudgetaire = []
  private lignes = ''
  private domain = 'Fonctionnement'
  private chapitresOptions: any = AppModule.budgetStructure.fonctionnement

  created() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
    getUsers({}).then((response) => {
      this.usersList = response.data
    }).catch((error) => {
      console.log('error when getting users', error)
    })
  }

  private ligneChanged() {
    this.lignes = [...new Set(this.lignesBudgetaire.map((el) => {
      return el[2]
    }))].join(',')
  }

  private domainChanged() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
    console.log("New domain ", this.domain)
  }

  private operationTypeChanged() {
    this.operateurs[this.operationType] = this.operateurSelect.join(',')
    console.log('operationTypeChanged ', this.operateurs)
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

  get statutString() {
    return this.statut.join(',')
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
  
  private operationSelect = [
    {
      value: 'SAISI',
      label: 'Saisi par...'
    },
    {
      value: 'VALIDP',
      label: 'Validés au 1er niveau par ...'
    },
    {
      value: 'VALIDS',
      label: 'Validés au 2nd niveau par ...'
    },
    {
      value: 'VALIDF',
      label: 'Validés au niveau final par ...'
    }
  ]
  
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
