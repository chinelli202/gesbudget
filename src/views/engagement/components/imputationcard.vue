<template>
  <div>
    <el-card shadow="always">
      <el-container>
        <el-header>
          <h2 align="center">
            Imputation {{ imputation.id }} de l'Engagement {{ engagement.code }}
          </h2>
        </el-header>
        <el-main
          v-loading="cardLoading"
        >
          <el-alert
            v-if="imputation.next_statut !== null"
            title="Cette imputation a été renvoyé pour modification."
            type="info"
            :closable="false"
            style="max-width: 400vw; margin-bottom: 10px"
            center
            show-icon
          />
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
            <el-form-item label="Montant TTC">
              <el-row :gutter="10">
                <el-col :span="3">
                  <el-form-item label="">
                    <el-select
                      v-model="imputation.devise"
                      placeholder="Devise"
                      :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
                      @change="formAttributeChange"
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
                    v-model="imputation.montant_ttc"
                    :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
                    @input="formAttributeChange"
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
            :update="updateSubmit"
            :resend-update="resendUpdate"
            :validerp-submit="validerpSubmit"
            :validers-submit="validersSubmit"
            :validerf-submit="validerfSubmit"
            :restore="fbRestoreImputation"
            :options-annuler-valider="optionsAnnulerValider"
            :commentaire-submit="fbcommentaireSubmit"
            :close="fbcloseImputation"
            :send-back-submit="fbsendBackSubmit"
            :cancel-valider-submit="fbcancelValiderSubmit"
            :next-etat-action="launchApurer"
            :next-etat-action-text="nextEtatActionText"
            :is-next-etat-action="isNextEtatAction"
            @footerload="loadHandler($event)"
            @updateBtnStateChanged="isbtnUpdate = $event"
            @resendBtnStateChanged="isResendUpdate = $event"
          />
        </el-main>
      </el-container>
    </el-card>

    <el-dialog
      v-loading="apurerFormLoading"
      :visible.sync="apurerFormVisible"
      width="75%"
      :append-to-body="true"
      top="3vh"
    >
      <el-form
        ref="apurementForm"
        :model="apurement"
        autocomplete="on"
      >
        <el-row
          type="flex"
          justify="center"
        >
          <el-col
            :span="10"
          >
            <h1 style="text-align: center">
              Apurer l'engagement {{ engagement.id }}
            </h1>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Engagement</strong>
            </el-col>
            <el-col :span="17">
              <el-input
                v-model="engagement.code"
                :disabled="true"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="10">
          <el-col
            :span="3"
            :offset="2"
          >
            <strong>Reference paiement</strong>
          </el-col>
          <el-col :span="17">
            <el-form-item
              prop="reference_paiement"
              :rules="[{ validator: validateReference, trigger: 'blur' }]"
            >
              <el-input
                v-model="apurement.reference_paiement"
                @input="apurerFormAttributeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          style="margin-bottom: 2em"
        >
          <el-col
            :span="3"
            :offset="2"
          >
            <strong>Libelle</strong>
          </el-col>
          <el-col :span="17">
            <el-form-item
              prop="libelle"
              :rules="[{ validator: validateLibelle, trigger: 'blur' }]"
            >
              <el-input
                v-model="apurement.libelle"
                @input="apurerFormAttributeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          style="margin-bottom: 2em"
        >
          <el-col
            :span="3"
            :offset="2"
          >
            <strong>Observations</strong>
          </el-col>
          <el-col :span="17">
            <el-form-item
              prop="observations"
              :rules="[{ validator: validateObservation, trigger: 'blur' }]"
            >
              <el-input
                v-model="apurement.observations"
                type="textarea"
                :rows="3"
                @input="apurerFormAttributeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Montant TTC</strong>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="apurement.devise"
                placeholder="Devise"
                @input="apurerFormAttributeChange"
              >
                <el-option
                  v-for="(obj) in deviseOptions"
                  :key="obj.code"
                  :label="obj.code"
                  :value="obj.code"
                />
              </el-select>
            </el-col>
            <el-col :span="13">
              <el-form-item
                prop="montant_ttc"
                :rules="[{ validator: validateMontant, trigger: 'blur' }]"
              >
                <el-input
                  v-model="apurement.montant_ttc"
                  @input="apurerFormAttributeChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
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
            <el-button @click="apurerFormVisible = false">Annuler</el-button>
            <el-button
              type="primary"
              :disabled="submitApurerDisabled"
              @click="apurerEngagement"
            >
              Apurer l'engagement
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { Form as ElForm } from 'element-ui'
import FooterButtons from './footerbuttons'
import {
  updateImputation, resendUpdateImputation, addComment
  , closeImputation, restoreImputation, sendBack, validationImputation
  , cancelValidationImputation
} from '@/api/imputations'
import { apurerEngagement } from '@/api/apurements'

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

  private validateReference = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir une référence de paiement à cette opération.'))
    } else {
      callback()
    }
  }

  private validateLibelle = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir un libellé à cet engagement.'))
    } else if(value.length < 4) {
      callback(new Error('Le libellé saisi doit avoir au moins 4 caractères.'))
    } else {
      callback()
    }
  }
  
  private validateObservation = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir une observation à cette imputation.'))
    } else if(value.length < 4) {
      callback(new Error('L\'observation saisie doit avoir au moins 4 caractères.'))
    } else {
      callback()
    }
  }

  private validateMontant = (rule: any, value: number, callback: Function) => {
    if (value < 1) {
      callback(new Error('Vous ne pouvez pas imputer l\'engagement avec un solde nul.'))
    } else if (this.maxMontant() < value ) {
      callback(new Error(
        `Le montant ${this.engagement.cumul_apurements === 0 ? 'imputé' : 'qu\'il reste à réaliser/apurer pour cet engagement'} est de ${this.maxMontant().toLocaleString()} ${this.imputation.devise}.
        Vous ne pouvez pas effectuer une réalisation au delà de cette somme.`
      ))
    } else {
      callback()
    }
  }

  private cardLoading = false
  private cardActive = false
  private isbtnUpdate = false
  private isResendUpdate = false
  private submitDisabled = true

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private nextEtatActionText = "Apurer l'engagement"
  private isNextEtatAction = false

  /** Variables for Imputation dialog form */
  private apurerFormVisible = false
  private apurerFormLoading = false
  private submitApurerDisabled = true
  private tvaApurerMismatch = false

  private apurement = {
    engagement_id: '',
    reference_paiement: '',
    montant_ttc: 0,
    devise: 'XAF',
    observations: '',
    libelle: '',
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

  private maxMontant() {
    return this.engagement.cumul_imputations - this.engagement.cumul_apurements
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
      montant_ttc: 0,
      devise: 'XAF',
      observations: '',
      libelle: '',
      statut: '',
      next_statut: '',
      files: []
    }
  }

  private launchApurer() {
    this.apurement.montant_ttc = this.engagement.montant_ttc
    this.apurement.devise = this.engagement.devise
    this.apurerFormVisible = true
  }

  private apurerEngagement() {
    (this.$refs.apurementForm as ElForm).validate(async(valid: boolean) => {
      if(valid) {
        console.log('Imputation de lengagement avec fichiers ' + this.apurement.files)
        this.apurerFormLoading = true
        this.apurement.engagement_id = this.engagement.code
        apurerEngagement(this.apurement).then((response:any) => {
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
      } else {
        return false
      }
    })
  }

  private apurerFormAttributeChange() {
    this.submitApurerDisabled = false
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
  }

  private formAttributeChange() {
    this.submitDisabled = false
  }

}
</script>
