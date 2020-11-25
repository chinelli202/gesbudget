<template>
  <div>
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
        :model="engagement"
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
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Reference</strong>
            </el-col>
            <el-col :span="17">
              <el-input
                v-model="apurement.reference"
                @input="apurerFormAttributeChange"
              />
            </el-col>
          </el-row>
        </el-form-item>
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
            <el-input
              v-model="apurement.libelle"
              @input="apurerFormAttributeChange"
            />
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
            <el-input
              v-model="apurement.observations"
              type="textarea"
              :rows="3"
              @input="apurerFormAttributeChange"
            />
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
            <el-col :span="12">
              <el-input
                v-model="apurement.montant_ht"
                @input="changeApurerMontantHT"
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
                v-model="apurement.montant_ttc"
                :disabled="true"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :offset="2"
              :span="20"
            >
              <el-alert
                v-if="tvaApurerMismatch"
                title="Le taux de TVA de l'engagement est différent du taux de tva actuel"
                type="warning"
                :closable="false"
                center
                show-icon
              />
            </el-col>
          </el-row>
          <el-row
            v-if="false"
            style="margin-top: 2em"
          >
            <el-col
              :offset="2"
              :span="18"
            >
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="apurement.files"
                :on-change="changeApurerFile"
                :disabled="true"
                multiple
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  Déposer les fichiers ici ou<em>cliquez pour envoyer</em>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  Fichiers jpg/png avec une taille inférieure à 500kb
                </div>
              </el-upload>
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
    montant_ht: 0,
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
      libelle: '',
      statut: '',
      next_statut: '',
      files: []
    }
  }

  private launchApurer() {
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

  private apurerFormAttributeChange() {
    this.submitApurerDisabled = false
  }

  private changeApurerMontantHT(value: number) {
    this.apurement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.apurerFormAttributeChange()
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

  private changeMontantHT(value: number) {
    this.imputation.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }
}
</script>
