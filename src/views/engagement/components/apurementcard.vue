<template>
  <el-card shadow="always">
    <el-container>
      <el-header>
        <h2 align="center">
          Apurement de l'Engagement {{ engagement.code }}
        </h2>
      </el-header>
      <el-main
        v-loading="cardLoading"
      >
        <el-alert
          v-if="apurement.next_statut !== null"
          title="Cet apurement a été renvoyé pour modification."
          type="info"
          :closable="false"
          style="max-width: 400vw; margin-bottom: 10px"
          center
          show-icon
        />
        <el-form
          ref="form"
          :model="apurement"
          label-width="100px"
        >
          <el-form-item label="Engagement">
            <el-input
              v-model="engagement.code"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item
            label="Reference"
            prop="reference_paiement"
            :rules="[{ validator: validateReferenceApurement, trigger: 'blur' }]"
          >
            <el-input
              v-model="apurement.reference_paiement"
              :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
              @input="formAttributeChange"
            />
          </el-form-item>
          <el-form-item
            label="Libelle"
            prop="libelle"
            :rules="[{ validator: validateLibelleApurement, trigger: 'blur' }]"
          >
            <el-input
              v-model="apurement.libelle"
              :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
              @input="formAttributeChange"
            />
          </el-form-item>
          <el-form-item
            label="Observations"
            prop="observations"
            :rules="[{ validator: validateObservationApurement, trigger: 'blur' }]"
          >
            <el-input
              v-model="apurement.observations"
              type="textarea"
              :rows="2"
              :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
              @input="formAttributeChange"
            />
          </el-form-item>
          <el-form-item label="Montant TTC">
            <el-row :gutter="10">
              <el-col :span="3">
                <el-select
                  v-model="apurement.devise"
                  placeholder="Devise"
                  filterable
                  remote
                  :remote-method="selectDevise"
                  :loading="deviseLoading"
                  :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
                  @change="formAttributeChange"
                >
                  <el-option
                    v-for="(obj) in deviseOptions"
                    :key="obj.code"
                    :label="obj.libelle"
                    :value="obj.code"
                  />
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  style="width: 100%"
                  v-model="apurement.type_paiement"
                  placeholder="Type de paiement"
                  :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
                  @change="formAttributeChange"
                >
                  <el-option
                    v-for="(obj) in typesPaiementOptions"
                    :key="obj.code"
                    :label="obj.libelle"
                    :value="obj.code"
                  />
                </el-select>
              </el-col>
              <el-col :span="15">
                <el-form-item
                  prop="montant_ttc"
                  :rules="[{ validator: validateMontantApurement, trigger: 'blur' }]"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="apurement.montant_ttc"
                    :min="0"
                    :controls="false"
                    :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
                    @input="formAttributeChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="Statut">
            <el-input
              v-model="apurement.statut_libelle"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item
            v-if="apurement.etat"
            label="Etat"
          >
            <el-input
              v-model="apurement.etat_libelle"
              :disabled="true"
            />
          </el-form-item>

        </el-form>
        <footer-buttons
          :entity="apurement"
          type="apurement"
          :submit-disabled="submitDisabled"
          :fallback-url="fallbackUrl"
          :on-cancel="onCancel"
          :update="updateSubmit"
          :resend-update="resendUpdate"
          :validerp-submit="validerpSubmit"
          :validers-submit="validersSubmit"
          :validerf-submit="validerfSubmit"
          :restore="fbRestoreApurement"
          :options-annuler-valider="optionsAnnulerValider"
          :commentaire-submit="fbcommentaireSubmit"
          :close="fbcloseApurement"
          :send-back-submit="fbsendBackSubmit"
          :cancel-valider-submit="fbcancelValiderSubmit"
          :is-next-etat-action="false"
          @footerload="loadHandler($event)"
          @updateBtnStateChanged="isbtnUpdate = $event"
          @resendBtnStateChanged="isResendUpdate = $event"
        />
      </el-main>
    </el-container>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { Form as ElForm } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import FooterButtons from '@/views/engagement/components/footerbuttons.vue'
import {
  updateApurement, resendUpdateApurement, addComment
  , closeApurement, restoreApurement, sendBack, validationApurement
  , cancelValidationApurement
} from '@/api/apurements'

@Component({
  name: 'ApurementCard',
  components: {
    FooterButtons
  }
})

export default class ApurementCard extends Vue {
  @Prop({ required: true }) private engagement!: any
  @Prop({ required: true }) private apurement!: any
  @Prop({ required: true }) private listeDevises!: any
  @Prop({ required: true }) private typesPaiementOptions!: any
  @Prop({ required: true }) private tva!: any
  @Prop({ required: true }) private fallbackUrl!: any

  private validateReferenceApurement = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir une référence de paiement à cette opération.'))
    } else {
      callback()
    }
  }

  private validateLibelleApurement = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir un libellé à cet engagement.'))
    } else if(value.length < 4) {
      callback(new Error('Le libellé saisi doit avoir au moins 4 caractères.'))
    } else {
      callback()
    }
  }
  
  private validateObservationApurement = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir une observation à cet engagement.'))
    } else if(value.length < 4) {
      callback(new Error('L\'observation saisie doit avoir au moins 4 caractères.'))
    } else {
      callback()
    }
  }

  private validateMontantApurement = (rule: any, value: number, callback: Function) => {
    if (value < 1) {
      callback(new Error('Vous ne pouvez pas imputer l\'engagement avec un solde nul.'))
    } else if (this.maxMontant() < value ) {
      callback(new Error(
        `Le montant ${this.engagement.cumul_apurements === 0 ? 'imputé' : 'qu\'il reste à réaliser/apurer pour cet engagement'} est de ${this.maxMontant().toLocaleString()} ${this.engagement.devise}.
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

  private apurerFormLoading = false
  private apurerFormVisible = false

  private nextEtatActionText = "Apurer l'engagement"
  private isNextEtatAction = false

  private deviseLoading: boolean = false
  private deviseOptions: string[] = []

  created() {
    this.cardLoading = true
    this.updateViewVariables()
    this.cardLoading = false
  }

  mounted() {
    this.$watch('apurement', apurement => {
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

  private selectDevise(query: string) {
    if (query !== '') {
      this.deviseLoading = true;
      this.deviseLoading = false;
      this.deviseOptions = this.listeDevises.filter((item: any) => {
        return item.libelle.toLowerCase()
          .indexOf(query.toLowerCase()) > -1;
      });
    }
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
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if(valid) {
        this.cardLoading = true
        updateApurement(this.apurement).then((response) => {
          this.$emit('engagementChanged', response.data)
          this.updateViewVariables()
          this.cardLoading = false
        }).catch(error => {
          this.cardLoading = false
          console.log('Error update', error)
        })
        // window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
      } else {
          return false
      }
    })
  }

  private async resendUpdate() {
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if(valid) {
        this.cardLoading = true
        resendUpdateApurement(this.apurement).then((response) => {
          this.$emit('engagementChanged', response.data)
          this.updateViewVariables()
          this.cardLoading = false
        }).catch(error => {
          this.cardLoading = false
          console.log('Error resendUpdate', error)
        })
      } else {
          return false
      }
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
    validationApurement({ id: this.apurement.id, statut: statut }).then((response) => {
      this.$emit('engagementChanged', response.data)
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error validationApurement', error)
    })
  }

  private async fbcancelValiderSubmit(id:number, comment:string, statut:string) {
    this.cardLoading = true
    cancelValidationApurement({ id: id, comment: comment, statut: statut }).then((response) => {
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
      statut: '',
      next_statut: '',
      files: []
    }
  }

  private launchImputer() {
    this.apurement.montant_ttc = this.engagement.montant_ttc
    this.apurement.devise = this.engagement.devise
    this.apurerFormVisible = true
  }

  private async fbcloseApurement(id: number, comment: string) {
    this.cardLoading = true
    const response = await closeApurement({ id: id, comment: comment })
    this.$emit('engagementChanged', response.data)
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private async fbRestoreApurement(id: number, comment: string) {
    this.cardLoading = true
    const response = await restoreApurement({ id: id, comment: comment })
    this.$emit('engagementChanged', response.data)
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private updateViewVariables() {

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
    this.apurement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }
}
</script>
