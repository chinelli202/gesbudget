<template>
  <el-card shadow="always">
    <el-container>
      <el-header>
        <h2 align="center">
          Imputation {{ imputation.id }} de l'engagement {{ engagement.id }}
        </h2>
      </el-header>
      <el-main
        v-loading="cardLoading"
      >
        <el-form
          ref="form"
          :model="engagement"
          label-width="100px"
        >
          <el-form-item label="Engagement">
            <el-input
              v-model="engagement.code"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="Reference">
            <el-input
              v-model="imputation.reference"
              :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
            />
          </el-form-item>
          <el-form-item label="Observations">
            <el-input
              v-model="imputation.observations"
              type="textarea"
              :rows="2"
              :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
              @input="formAttributeChange"
            />
          </el-form-item>
          <el-form-item label="Montant HT">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-form-item label="">
                  <el-select
                    v-model="imputation.devise"
                    placeholder="Devise"
                    :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
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
              <el-col :span="18">
                <el-input
                  v-model="imputation.montant_ht"
                  :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
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
                  v-model="imputation.montant_ttc"
                  :disabled="true"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="Statut">
            <el-input
              v-model="imputation.statut_libelle"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item
            v-if="imputation.etat"
            label="Etat"
          >
            <el-input
              v-model="imputation.etat_libelle"
              :disabled="true"
            />
          </el-form-item>

          <el-form-item
            class="notes"
            style="line-height: 25px;"
          >
            <el-row :gutter="10">
              <el-col
                :span="6"
                :offset="3"
              >
                Créé le
              </el-col>
              <el-col :span="15">
                {{ imputation.created_at | dateFormatLong }}
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col
                :span="6"
                :offset="3"
              >
                Saisi par
              </el-col>
              <el-col :span="15">
                {{ (isCurrentUserSaisisseur) ? "Vous même" : imputation.saisisseur_name }}
              </el-col>
            </el-row>
            <el-row
              v-if="imputation.valideur_first && imputation.valideur_first !== ''"
              :gutter="10"
            >
              <el-col
                :span="6"
                :offset="3"
              >
                Validation 1ère par
              </el-col>
              <el-col :span="15">
                {{ (isCurrentUserValideurp) ? "Vous même" : imputation.valideurp_name }}
              </el-col>
            </el-row>
            <el-row
              v-if="imputation.valideur_second && imputation.valideur_second !== ''"
              :gutter="10"
            >
              <el-col
                :span="6"
                :offset="3"
              >
                Validation 2nde par
              </el-col>
              <el-col :span="15">
                {{ (isCurrentUserValideurs) ? "Vous même" : imputation.valideurs_name }}
              </el-col>
            </el-row>
            <el-row
              v-if="imputation.valideur_final && imputation.valideur_final !== ''"
              :gutter="10"
            >
              <el-col
                :span="6"
                :offset="3"
              >
                Validation finale par
              </el-col>
              <el-col :span="15">
                {{ (isCurrentUserValideurf) ? "Vous même" : imputation.valideurf_name }}
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <footer-buttons
          :entity="imputation"
          type="imputation"
          :submit-disabled="submitDisabled"
          :fallback-url="fallbackUrl"
          :on-cancel="onCancel"
          :update-submit="updateSubmit"
          :resend-update="resendUpdate"
          :validerp-submit="validerpSubmit"
          :validers-submit="validersSubmit"
          :validerf-submit="validerfSubmit"
          :restore-preeng="fbRestoreImputation"
          :options-annuler-valider="optionsAnnulerValider"
          :commentaire-submit="fbcommentaireSubmit"
          :close-preeng="fbcloseImputation"
          :send-back-submit="fbsendBackSubmit"
          :cancel-valider-submit="fbcancelValiderSubmit"
          :next-etat-action="launchImputer"
          :next-etat-action-text="nextEtatActionText"
          :is-next-etat-action="isNextEtatAction"
          @footerload="loadHandler($event)"
          @updateBtnStateChanged="isbtnUpdate = $event"
          @resendBtnStateChanged="resendUpdate = $event"
        />
      </el-main>
    </el-container>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import FooterButtons from './footerbuttons'
import {
  updateImputation, resendUpdateImputation, addComment
  , closeImputation, restoreImputation, sendBack, validationImputation
  , apurerEngagement, cancelValidationImputation
} from '@/api/imputations'

@Component({
  name: 'ImputationCard',
  components: {
    FooterButtons
  }
})

export default class ImputationCard extends Vue {
  @Prop({ required: true }) private engagement!: any
  @Prop({ required: true }) private imputation!: any
  @Prop({ required: true }) private deviseOptions!: any
  @Prop({ required: true }) private tva!: any
  @Prop({ required: true }) private fallbackUrl!: any

  private cardLoading = false
  private cardActive = false
  private isbtnUpdate = false
  private isResendUpdate = false
  private submitDisabled = true

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private apurerFormLoading = false
  private apurerFormVisible = false

  private nextEtatActionText = "Apurer l'engagement"
  private isNextEtatAction = false

  private apurement = {
    engagement_id: '',
    reference_paiement: '',
    montant_ht: 0,
    montant_ttc: 0,
    devise: 'XAF',
    observations: '',
    statut: '',
    next_statut: '',
    files: []
  }

  created() {
    this.cardLoading = true
    this.updateViewVariables()
    this.cardLoading = false
  }

  mounted() {
    this.$watch('imputation', imputation => {
      this.initializeCard()
    }, { immediate: true })
  }

  private initializeCard() {
    this.cardLoading = true
    this.updateViewVariables()
    this.cardLoading = false
  }

  private onCancel() {
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/')
  }

  private optionsAnnulerValider() {
    console.log('optionsAnnulerValider')
    this.updateViewVariables()
  }

  private async fbcommentaireSubmit(id: number, comment:string) {
    const response = await addComment({ id: id, comment: comment })
    this.updateViewVariables()
    return response
  }

  private async updateSubmit() {
    this.cardLoading = true
    updateImputation(this.imputation).then((response) => {
      this.$emit('engagementChanged', response.data)
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error update', error)
    })
    // window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
  }

  private async resendUpdate() {
    this.cardLoading = true
    resendUpdateImputation(this.imputation).then((response) => {
      this.$emit('engagementChanged', response.data)
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error resendUpdate', error)
    })
  }

  private async fbsendBackSubmit(id: number, comment: string) {
    this.cardLoading = true
    const response = await sendBack({ id: id, comment: comment })
    this.$emit('engagementChanged', response.data)
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private validerpSubmit() {
    this.validerSubmit('VALIDP')
  }

  private validersSubmit() {
    this.validerSubmit('VALIDS')
  }

  private validerfSubmit() {
    this.validerSubmit('VALIDF')
  }

  private validerSubmit(statut: string) {
    this.cardLoading = true
    validationImputation({ id: this.imputation.id, statut: statut }).then((response) => {
      this.$emit('engagementChanged', response.data)
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error validationImputation', error)
    })
  }

  private async fbcancelValiderSubmit(id:number, comment:string, statut:string) {
    this.cardLoading = true
    cancelValidationImputation({ id: id, comment: comment, statut: statut }).then((response) => {
      this.$emit('engagementChanged', response.data)
      this.updateViewVariables()
      this.cardLoading = false
      return response
    }).catch(error => {
      this.cardLoading = false
      throw error
    })
  }

  private resetApurerForm() {
    this.apurement = {
      engagement_id: '',
      reference_paiement: '',
      montant_ht: 0,
      montant_ttc: 0,
      devise: 'XAF',
      observations: '',
      statut: '',
      next_statut: '',
      files: []
    }
  }

  private launchImputer() {
    this.apurement.montant_ht = this.engagement.montant_ht
    this.apurement.montant_ttc = this.engagement.montant_ttc
    this.apurement.devise = this.engagement.devise
    this.apurerFormVisible = true
  }

  private apurerEngagement() {
    console.log('Imputation de lengagement avec fichiers ' + this.imputation.files)
    this.apurerFormLoading = true
    this.imputation.engagement_id = this.engagement.code
    apurerEngagement(this.imputation).then((response:any) => {
      this.$emit('engagementChanged', response.data)
      this.updateViewVariables()
      this.apurerFormLoading = false
      this.apurerFormVisible = false
      this.resetApurerForm()
    }).catch(error => {
      this.apurerFormLoading = false
      this.apurerFormVisible = false
      console.log('Erreur lors de l\'apurement de l\'engagement ', error)
    })
    // TODO : handle file upload
    this.updateViewVariables()
  }

  private async fbcloseImputation(id: number, comment: string) {
    this.cardLoading = true
    const response = await closeImputation({ id: id, comment: comment })
    this.$emit('engagementChanged', response.data)
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private async fbRestoreImputation(id: number, comment: string) {
    this.cardLoading = true
    const response = await restoreImputation({ id: id, comment: comment })
    this.$emit('engagementChanged', response.data)
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private updateViewVariables() {
    this.isCurrentUserSaisisseur = UserModule.matricule === this.imputation.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule === this.imputation.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule === this.imputation.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule === this.imputation.valideur_final

    this.nextEtatActionText = this.engagement.cumul_apurements_initie_ttc > 0 ? 'Nouvel apurement' : "Apurer l'engagement"
    if (this.engagement.cumul_apurements < this.engagement.montant_ttc) {
      this.isNextEtatAction = true
    } else {
      this.isNextEtatAction = false
    }

    // If the engagement is closed then the card should be inactive
    this.cardActive = !(this.engagement.etat === AppModule.etatsEngagement.CLOT.code)
    console.log('variables imputation', this.cardActive, this.isbtnUpdate, this.isResendUpdate, !this.cardActive || (!this.isbtnUpdate && !this.isResendUpdate))
  }

  private formAttributeChange() {
    this.submitDisabled = false
  }

  private changeMontantHT(value: number) {
    this.imputation.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }
}
</script>
