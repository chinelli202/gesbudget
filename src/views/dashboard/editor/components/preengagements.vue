<template>
  <div>
    <el-row>
      <el-col :span="10">
        <h1>Pré engagements initiés</h1>
      </el-col>
      <el-col
        :span="4"
        :offset="9"
      >
        <div>
          <el-button
            type="primary"
            @click="launchDialogForm"
          >
            Créer un engagement
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="initiatedEngagements"
      height="700"
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="50"
      />
      <el-table-column
        fixed
        prop="created_at"
        :formatter="dateFormatter"
        label="Date"
        width="130"
      />
      <el-table-column
        fixed
        prop="code"
        label="Code"
        width="170"
      />
      <el-table-column
        prop="libelle"
        label="Libellé"
        width="250"
      />
      <el-table-column
        prop="statut"
        label="Statut"
        width="75"
      />
      <el-table-column
        prop="montant_ht"
        :formatter="numFormatter"
        label="Montant HT"
        width="150"
      />
      <el-table-column
        prop="montant_ttc"
        :formatter="numFormatter"
        label="Montant TTC"
        width="150"
      />
      <el-table-column
        prop="devise"
        label="Devise"
        width="75"
      />
      <el-table-column
        prop="nature"
        label="Nature"
        width="75"
      />
      <el-table-column
        prop="type"
        label="Type"
        width="75"
      />
      <el-table-column
        prop="etat"
        label="Etat"
        width="75"
      />
      <el-table-column
        prop="saisisseur"
        label="Saisi par"
        width="100"
      />
      <el-table-column
        fixed="right"
        label="Opérations"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            size="small"
            @click="detail(scope.$index, scope.row)"
          >
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-loading="dialogFormLoading"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="engagement">
        <el-row
          type="flex"
          justify="center"
        >
          <el-col
            :span="12"
            :offset="2"
          >
            <h1>Créer un engagement</h1>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="center"
        >
          <el-col
            :span="8"
            :offset="2"
          >
            <el-radio-group
              v-model="domain"
              size="small"
              @change="domainChange"
            >
              <el-radio-button label="Fonctionnement" />
              <el-radio-button label="Mandat" />
            </el-radio-group>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Chapitre</strong>
            </el-col>
            <el-col :span="16">
              <el-cascader
                v-model="cascade"
                :options="chapitresOptions"
                :props="{expandTrigger: 'hover'}"
                @change="cascadeChange"
              />
              <!-- <el-autocomplete
                v-model="chapitre"
                :fetch-suggestions="querySearchAsync"
                placeholder="Choisir un chapitre"
                @select="handleSelect"
              ></el-autocomplete> -->
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="10">
          <el-col
            :span="20"
            :offset="2"
          >
            <el-form-item label="Libellé">
              <el-input
                v-model="engagement.libelle"
                type="textarea"
                :rows="3"
                @input="formAttributeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant HT</strong>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="engagement.devise"
                placeholder="Devise"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in deviseOptions"
                  :key="obj.code"
                  :label="obj.code"
                  :value="obj.code"
                />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="engagement.montant_ht"
                @input="changeMontantHT"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant TTC</strong>
            </el-col>
            <el-col
              :span="4"
            >
              <span class="span-label">
                <strong> TVA {{ tva.toLocaleString('fr-FR') }}%</strong>
              </span>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="engagement.montant_ttc"
                :disabled="true"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="10"
              :offset="2"
            >
              <span class="span-label">
                <strong>Nature</strong>
              </span>
            </el-col>
            <el-col
              :span="9"
              :offset="2"
            >
              <span class="span-label">
                <strong>Type</strong>
              </span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :span="10"
              :offset="2"
            >
              <el-select
                v-model="engagement.nature"
                placeholder="Nature"
                class="type-select"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in natureOptions"
                  :key="obj.code"
                  :label="obj.libelle"
                  :value="obj.code"
                >
                  <span style="float: left">{{ obj.libelle }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col
              :span="9"
              :offset="2"
            >
              <el-select
                v-model="engagement.type"
                placeholder="Type"
                class="type-select"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in typeOptions"
                  :key="obj.code"
                  :label="obj.libelle"
                  :value="obj.code"
                >
                  <span style="float: left">{{ obj.libelle }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row
          justify="end"
        >
          <el-col
            :span="20"
            :offset="2"
          >
            <el-button @click="dialogFormVisible = false">Annuler</el-button>
            <el-button
              type="primary"
              :disabled="submitDisabled"
              @click="createEngagement"
            >
              Créer l'engagement
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getEngagements, createEngagement } from '@/api/engagements'
import { IEngagementData } from '@/api/types'
import { AppModule } from '@/store/modules/app'
import { getBudgetStructure } from '@/api/variables'
import { REPLEval } from 'repl'

@Component({
  name: 'PreEngagements',
  components: {
  }
})

export default class PreEngagements extends Vue {
  private initiatedEngagements: IEngagementData[] = []
  private listLoading = true
  private domain = 'Fonctionnement'
  private chapitresBudget:Record<string, any> = {}
  private chapitresOptions = []
  private cascade = null

  /** Dialog Form Variables */
  // Add rules validation on the form to prevent incorrect submissions
  private formLabelWidth = '120px'
  private dialogFormVisible = false
  private dialogFormLoading = false
  private deviseOptions = {}
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0
  private submitDisabled = true
  private engagement = {
    montant_ht: null,
    montant_ttc: 0,
    nature: '',
    type: '',
    devise: 'XAF'
  }

  created() {
    this.getInitiatedEngagements()
  }

  detail(value: any, engagement: any) {
    this.$router.push({ name: 'DetailEngagement', params: { id: engagement.id } })
  }

  deleteRow(index: any, rows: any) {
    rows.splice(index, 1)
  }

  numFormatter(value: any, row: any, column: any) {
    return column.toLocaleString()
  }

  dateFormatter(value: any, row: any, column: any) {
    const currentDatetime = new Date(column)
    const formattedDate = currentDatetime.getDate() +
      '/' + (currentDatetime.getMonth() + 1) +
      '/' + currentDatetime.getFullYear() +
      ' ' + currentDatetime.getHours() + ':' + currentDatetime.getMinutes()
    return formattedDate
  }

  private async getInitiatedEngagements() {
    this.listLoading = true
    const { data } = await getEngagements({ etat: 'INIT' })
    this.initiatedEngagements = data
    this.listLoading = false
  }

  private domainChange() {
    console.log(this.domain)
    this.updateChapitres()
  }

  private updateChapitres() {
    this.chapitresOptions = this.chapitresBudget[this.domain]
    console.log(this.chapitresOptions)
  }

  /* querySearchAsync(queryString, cb) {
    var links = this.links;
    var results = queryString ? links.filter(this.createFilter(queryString)) : links;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      cb(results);
    }, 3000 * Math.random());
  } */

  private cascadeChange() {
    console.log(this.cascade)
  }

  private launchDialogForm() {
    this.deviseOptions = AppModule.devises
    this.typeOptions = AppModule.typesEngagement
    this.natureOptions = AppModule.naturesEngagement
    this.etatOptions = AppModule.etatsEngagement
    this.statutOptions = AppModule.statutsEngagement
    this.tva = AppModule.tva

    for (const domain in AppModule.budgetStructure) {
      for (const section in AppModule.budgetStructure[domain]) {
        this.chapitresBudget[domain] = this.chapitresBudget[domain].concat(AppModule.budgetStructure[domain][section].chapitres)
      }
      // this.chapitresBudget[domain] = this.chapitresBudget[domain].chapitres.map(
      //   (chapitre) => {
      //     return {
      //       label: chapitre.label,
      //       value: chapitre.id,
      //       children: chapitre.rubriques.map(
      //         (rubrique) => {
      //           return {
      //             label: rubrique.label,
      //             value: rubrique.id,
      //             children: rubrique.lignes.map(
      //               (ligne) => {
      //                 return {
      //                   label: ligne.label,
      //                   value: ligne.id
      //                 }
      //               }
      //             )
      //           }
      //         }
      //       )
      //     }
      //   }
      // )
    }
    console.log(AppModule.budgetStructure)
    this.dialogFormVisible = true
  }

  private createEngagement() {
    // this.dialogFormLoading = true
    console.log('this.engagement : ', this.engagement)
    createEngagement(this.engagement).then((response) => {
      const newEngagement = response.data
      this.initiatedEngagements.push(newEngagement)
      this.initiatedEngagements.sort((a, b) => b.id - a.id)
      this.submitDisabled = true
      this.dialogFormLoading = false
      this.dialogFormVisible = false
    })
  }

  private changeMontantHT(value: number) {
    this.engagement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitDisabled = false
  }

  // data() {
  //   const { data } = await getEngagements({ etat: 'INIT' });
  //   return {
  //     tableData: data,

  //     tableData2: [{
  //         date: '2016-05-03',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-02',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-04',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-01',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-08',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-06',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-07',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }]
  //   }
  // }
}

</script>
