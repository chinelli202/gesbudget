<template>
  <div class="clearfix">
    <div class="app-container max-w-600 center">
      <el-card shadow="always">
        <el-container>
          <el-header>
            <h1 align="center">
              Detail Engagement - {{ engagement.id }}
            </h1>
          </el-header>
          <el-alert
            v-if="engagementIsClosed"
            title="Ce pré-engagement a été clôturé."
            type="info"
            :closable="false"
            effect="dark"
            center
            show-icon
          />
          <el-alert
            v-else-if="engagement.next_statut !== null"
            title="Ce pré-engagement a été renvoyé pour modification."
            type="info"
            :closable="false"
            style="max-width: 400vw"
            center
            show-icon
          />
          <el-main
            v-loading="cardLoading"
          >
            <el-form
              ref="form"
              :model="engagement"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="Libellé">
                <el-input
                  v-model="engagement.libelle"
                  type="textarea"
                  :rows="2"
                  @change="formAttributeChange"
                />
              </el-form-item>
              <el-form-item label="Montant HT">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-form-item label="">
                      <el-select
                        v-model="engagement.devise"
                        placeholder="Devise"
                      >
                        <el-option
                          v-for="(obj) in deviseOptions"
                          :key="obj.code"
                          :label="obj.code"
                          :value="obj.code"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="engagement.montant_ht"
                      @input="changeMontantHT"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="Montant TTC">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <strong>TVA {{ tva.toLocaleString('fr-FR') }}%</strong>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="engagement.montant_ttc"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="no-margin-bottom">
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <span class="span-label">Type
                    </span>
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <span class="span-label">Statut
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <el-select
                      v-model="engagement.type"
                      placeholder="Type"
                      class="type-select"
                      @change="formAttributeChange"
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
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <el-input
                      v-model="engagement.statut_libelle"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <span class="span-label">Nature
                    </span>
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <span class="span-label">Etat
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <el-select
                      v-model="engagement.nature"
                      placeholder="Nature"
                      class="type-select"
                      @change="formAttributeChange"
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
                    :span="10"
                    :offset="1"
                  >
                    <el-input
                      v-model="engagement.etat_libelle"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="notes">
                <el-row
                  type="flex"
                  class="row-bg"
                  justify="end"
                >
                  <el-col :span="10">
                    <el-button @click="onCancel">
                      Retour
                    </el-button>
                    <el-button
                      type="primary"
                      :disabled="submitDisabled"
                      @click="createSubmit"
                    >
                      Créer l'engagement
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-main>
        </el-container>
      </el-card>

      next_statut : {{ engagement.next_statut }}<br>
      hasPermission {{ hasPermission("profile-read") }}<br>
      hasnotPermission {{ hasnotPermission("profile-read") }}<br><br>
      isbtnUpdate : {{ isbtnUpdate }}<br>
      isbtnValiderp : {{ isbtnValiderp }}<br>
      isbtnValiders : {{ isbtnValiders }}<br>
      isbtnValiderf : {{ isbtnValiderf }}<br>
      isbtnOk : {{ isbtnOk }}<br>
      isbtnClose : {{ isbtnClose }}<br>
      isbtnRestaurer : {{ isbtnRestaurer }}<br>
      isbtnRenvoyer : {{ isbtnRenvoyer }}<br>
      isbtnOptionsAnnuler : {{ isbtnOptionsAnnuler }}<br>
      isbtnAnnulerValider : {{ isbtnAnnulerValider }}<br>
      isbtnPlusDactions : {{ isbtnPlusDactions }}<br>
      isbtnImputer : {{ isbtnImputer }}<br><br>
      {{ typeOptions }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  detailEngagement
  , updateEngagement, validationpPreeng, validationPreeng, cancelValidationPreeng, cancelValidationpPreeng, validationsPreeng
  , resendUpdateEngagement, addComment, closePreeng, restorePreeng, sendBack
} from '@/api/engagements'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'DetailEngagement',
  components: {
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fallbackUrl = from.path
    })
  }
})

export default class extends Vue {
  private cardLoading = true
  private deviseOptions = {}
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0
  private fallbackUrl = { path: '/' }

  private submitDisabled = true;

  private engagement = {
    id: null,
    code: '',
    montant_ht: 0,
    montant_ttc: 0,
    saisisseur: '',
    saisisseur_name: '',
    statut: 'SAISI',
    next_statut: '',
    etat: 'INIT',
    valideur_first: '',
    valideur_second: '',
    valideur_final: '',
    etat_libelle: 'Initié',
    statut_libelle: 'Saisi'
  }

  private rules = {
    montant_ttc: [
      { required: true, message: 'Veuillez saisir un montant', trigger: 'blur' },
      { type: 'number', message: 'Veuillez saisir un nombre', trigger: 'blur' }
    ]
  }

  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(parseInt(id))
  }

  private async fetchData(engagementId: number) {
    this.cardLoading = true
    this.deviseOptions = AppModule.devises
    this.typeOptions = AppModule.typesEngagement
    this.natureOptions = AppModule.naturesEngagement
    this.etatOptions = AppModule.etatsEngagement
    this.statutOptions = AppModule.statutsEngagement
    this.tva = AppModule.tva

    this.cardLoading = false
  }

 

  private onCancel() {
    console.log("cancel", this.fallbackUrl)
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/')
  }

  private changeMontantHT(value: number) {
    this.engagement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitDisabled = false
  }

}

</script>

<style lang="scss" scoped>
.el-container{
  box-shadow: 2px;
}
.notes{
  color:gray;
}

.no-margin-bottom{
  margin-bottom: 0px;
}

.span-label{

}

.type-select .el-input__inner {
    padding-right: 149px;
}

.el-col-20{
    width: 86.7%;
  }

.max-w-600{
  max-width: 70vw;
}
.center{
  margin: auto;
}

</style>
