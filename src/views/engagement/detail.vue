<template>
  <div class="clearfix">
    <div class="app-container max-w-600 center">
      <div
        v-for="(apurement) in engagement.apurements_labelled"
        :key="apurement.id"
        style="margin-bottom: 2em"
      >
        <apurement-card
          :apurement="apurement"
          :engagement="engagement"
          :liste-devises="listeDevises"
          :types-paiement-options="typesPaiementOptions"
          :tva="tva"
          :fallback-url="fallbackUrl"
          @engagementChanged="engagementChanged"
        />
      </div>
      <div
        v-for="(imputation) in engagement.imputations_labelled"
        :key="imputation.id"
        style="margin-bottom: 2em"
      >
        <imputation-card
          :imputation="imputation"
          :engagement="engagement"
          :liste-devises="listeDevises"
          :types-paiement-options="typesPaiementOptions"
          :tva="tva"
          :fallback-url="fallbackUrl"
          @engagementChanged="engagementChanged"
        />
      </div>
      <el-card shadow="always">
        <el-container>
          <el-header>
            <el-row
              type="flex"
              justify="center"
              style="margin-bottom: 1.5em"
            >
              <el-col
                :span="10"
                :offset="2"
              >
                <h1 align="center">
                  Engagement {{ engagement.code }}
                </h1>
              </el-col>
            </el-row>
          </el-header>
          <el-main
            v-loading="cardLoading"
          >
            <el-alert
              v-if="engagementIsClosed"
              title="Ce pré-engagement a été clôturé."
              type="info"
              :closable="false"
              effect="dark"
              style="margin-bottom: 10px"
              center
              show-icon
            />
            <el-alert
              v-else-if="engagement.next_statut !== null"
              title="Ce pré-engagement a été renvoyé pour modification."
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
              <el-row
                type="flex"
                justify="center"
                style="margin-bottom: 1.5em"
              >
                <el-col
                  :span="4"
                  :offset="2"
                >
                  <el-radio-group
                    v-if="toEdit"
                    v-model="domain"
                    size="small"
                    @change="domainChange"
                  >
                    <el-radio-button label="Fonctionnement" />
                    <el-radio-button label="Mandat" />
                  </el-radio-group>
                  <el-input
                    v-else
                    v-model="domain"
                    :disabled="true"
                  />
                </el-col>
              </el-row>
              <el-form-item label="Code">
                <el-input
                  v-model="engagement.code"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item
                label="Ligne"
                prop="ligne_budgetaire"
                :rules="[{ validator: validateLigne, trigger: 'blur' }]"
              >
                <el-cascader
                  v-model="cascade"
                  :options="chapitresOptions"
                  :props="{expandTrigger: 'hover'}"
                  :disabled="!toEdit"
                  style="width: 100%"
                  placeholder="Choisir la ligne budgétaire"
                  class="cascade-extra-lg"
                  @change="cascadeChange"
                />
              </el-form-item>
              <el-form-item
                label="Date"
                prop="eng_date"
                :rules="[{ validator: validateDate, trigger: 'blur' }]"
              >
                <el-date-picker
                  style="width: 50%"
                  v-model="engagement.eng_date"
                  format="dd MMMM yyyy"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="Choississez un jour"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item
                label="Solde Ligne"
              >
                <strong>{{ soldeLigne.toLocaleString() }}</strong>
              </el-form-item>
              <el-form-item
                prop="libelle"
                label="Libellé"
                :rules="[{ validator: validateLibelle, trigger: 'blur' }]"
              >
                <el-input
                  v-model="engagement.libelle"
                  type="textarea"
                  :rows="2"
                  :disabled="!toEdit"
                  @input="formAttributeChange"
                />
              </el-form-item>
              <el-form-item label="Montant TTC">
                <el-row :gutter="10">
                  <el-col :span="3">
                      <el-select
                        v-model="engagement.devise"
                        placeholder="Devise"
                        filterable
                        remote
                        :remote-method="selectDevise"
                        :loading="deviseLoading"
                        :disabled="!toEdit"
                      >
                        <el-option
                          v-for="(obj) in listeDevises"
                          :key="obj.code"
                          :label="obj.code"
                          :value="obj.code"
                        />
                      </el-select>
                  </el-col>
                  <el-col :span="20">
                    <el-form-item
                      prop="montant_ttc"
                      :rules="[{ validator: validateMontantEngagement, trigger: 'blur' }]"
                    >
                      <el-input-number
                        style="width: 100%"
                        v-model="engagement.montant_ttc"
                        :min="0"
                        :controls="false"
                        :disabled="!toEdit"
                        @input="formAttributeChange"
                      />
                    </el-form-item>
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
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <el-form-item
                      prop="type"
                      :rules="[{ required: true, message: 'Veuillez choisir un type pour cet engagement', trigger: 'change' }]"
                    >
                      <el-select
                        v-if="toEdit"
                        v-model="engagement.type"
                        placeholder="Type"
                        style="width: 100%"
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
                      <el-input
                        v-else
                        v-model="engagement.type_libelle"
                        :disabled="true"
                      />
                    </el-form-item>
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
                    <span class="span-label">Statut
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <el-input
                      v-model="engagement.statut_libelle"
                      :disabled="true"
                    />
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
                    {{ engagement.created_at | dateFormatLong }}
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
                    {{ (isCurrentUserSaisisseur) ? "Vous même" : engagement.saisisseur_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_first && engagement.valideur_first !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation 1ère par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserValideurp) ? "Vous même" : engagement.valideurp_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_second && engagement.valideur_second !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation 2nde par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserValideurs) ? "Vous même" : engagement.valideurs_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_final && engagement.valideur_final !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation finale par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserValideurf) ? "Vous même" : engagement.valideurf_name }}
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <footer-buttons
              :entity="engagement"
              type="engagement"
              :submit-disabled="submitUpdateDisabled"
              :fallback-url="fallbackUrl"
              :on-cancel="onCancel"
              :update="updateSubmit"
              :resend-update="resendUpdate"
              :validerp-submit="validerpSubmit"
              :validers-submit="validersSubmit"
              :validerf-submit="validerfSubmit"
              :restore="fbRestorePreeng"
              :options-annuler-valider="optionsAnnulerValider"
              :commentaire-submit="fbcommentaireSubmit"
              :close="fbclosePreeng"
              :send-back-submit="fbsendBackSubmit"
              :cancel-valider-submit="fbcancelValiderSubmit"
              :next-etat-action="launchImputer"
              :next-etat-action-text="nextEtatActionText"
              :is-next-etat-action="isNextEtatAction"
              @footerload="loadHandler($event)"
            />
          </el-main>
        </el-container>
      </el-card>
    </div>

    <el-dialog
      v-loading="imputerFormLoading"
      :visible.sync="imputerFormVisible"
      width="75%"
      :append-to-body="true"
      top="3vh"
    >
      <el-form
        ref="imputationForm"
        :model="imputation"
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
              Imputer l'engagement {{ engagement.code }}
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
              <strong>Reference</strong>
            </el-col>
            <el-col :span="17">
              <el-form-item
                prop="reference"
                :rules="[{ validator: validateReference, trigger: 'blur' }]"
              >
                <el-input
                  v-model="imputation.reference"
                  @input="imputerFormAttributeChange"
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
                v-model="imputation.observations"
                type="textarea"
                :rows="3"
                @input="imputerFormAttributeChange"
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
              v-model="imputation.devise"
              placeholder="Devise"
              filterable
              remote
              :remote-method="selectDevise"
              :loading="deviseLoading"
              @input="imputerFormAttributeChange"
            >
              <el-option
                v-for="(obj) in listeDevises"
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
              <el-input-number
                style="width: 100%"
                v-model="imputation.montant_ttc"
                :min="0"
                :controls="false"
                @input="imputerFormAttributeChange"
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
            <el-button @click="imputerFormVisible = false">Annuler</el-button>
            <el-button
              type="primary"
              :disabled="submitImputerDisabled"
              @click="imputerEngagement"
            >
              Imputer l'engagement
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  detailEngagement
  , updateEngagement, validationPreeng, cancelValidationPreeng
  , resendUpdateEngagement, addComment, closePreeng, restorePreeng, sendBack
} from '@/api/engagements'
import { getSoldeLigne } from '@/api/lignes'
import { imputerEngagement } from '@/api/imputations'
import FooterButtons from '@/views/engagement/components/footerbuttons.vue'
import ImputationCard from '@/views/engagement/components/imputationcard.vue'
import ApurementCard from '@/views/engagement/components/apurementcard.vue'
import { Form as ElForm } from 'element-ui'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'DetailEngagement',
  components: {
    FooterButtons
    , ImputationCard
    , ApurementCard
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      (vm as any).fallbackUrl = from.path
    })
  }
})

export default class extends Vue {
  private validateReference = (rule: any, value: string, callback: Function) => {
    console.log('validate reference', value, rule)
    if (!value) {
      callback(new Error('Veuillez saisir une référence à cette imputation.'))
    } else {
      callback()
    }
  }
  
  private validateObservation = (rule: any, value: string, callback: Function) => {
    console.log('validate observation')
    if (!value) {
      callback(new Error('Veuillez saisir une observation à cette imputation.'))
    } else if(value.length < 4) {
      callback(new Error('L\'observation saisie doit avoir au moins 4 caractères.'))
    } else {
      callback()
    }
  }

  private validateMontant = (rule: any, value: number, callback: Function) => {
    console.log('validate montant limite', this.maxMontant())
    if (value < 1) {
      callback(new Error('Vous ne pouvez pas imputer l\'engagement avec un solde nul.'))
    } else if (this.maxMontant() < value ) {
      callback(new Error(
        `Le montant ${this.engagement.cumul_imputations === 0 ? 'engagé' : 'qu\'il reste à imputer pour cet engagement'} est de ${this.maxMontant().toLocaleString()} ${this.imputation.devise}.
        Vous ne pouvez pas imputer au delà de cette somme.`))
    } else {
      callback()
    }
  }

  private validateMontantEngagement = (rule: any, value: number, callback: Function) => {
    console.log('validate montant limite', this.maxMontantEngagement())
    if (this.maxMontantEngagement() > 1 && value < 1) {
      callback(new Error(`Veuillez saisir un montant différent de 0 et inférieur au solde de la ligne qui est de ${this.maxMontantEngagement().toLocaleString()} XAF.`))
    } else if (this.maxMontantEngagement() < value ) {
      callback(new Error(`Le solde restant pour cette ligne budgétaire est de ${this.maxMontantEngagement().toLocaleString()} XAF.
      Vous ne pouvez pas créer un engagement d'un montant supérieur à cette somme.`))
    } else {
      callback()
    }
  }

  private validateLibelle = (rule: any, value: string, callback: Function) => {
    console.log('validate libelle')
    if (!value) {
      callback(new Error('Veuillez saisir un libellé à cet engagement'))
    } else if(value.length < 4) {
      callback(new Error('Le libellé saisi doit avoir au moins 4 caractères'))
    } else {
      callback()
    }
  }

  private validateLigne = (rule: any, value: number, callback: Function) => {
    console.log('validate ligne ', this.selectedLigne())
    if (this.selectedLigne().length === 0) {
      callback(new Error('Veuillez choisir une ligne budgétaire'))
    } else if (this.maxMontantEngagement() === 0) {
      callback(new Error('Vous ne pouvez pas choisir une ligne avec un solde nul'))
    } else {
      callback()
    }
  }

    private validateDate = (rule: any, value: number, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir une date pour cet engagement'))
    } else {
      callback()
    }
  }

  /** Ligne budgetaire cascader */
  private domain = 'Fonctionnement'
  private chapitresOptions: any = AppModule.budgetStructure.fonctionnement
  private cascade: number[] = []
  private soldeLigne = 0

  /** Main card form attributes */
  private cardLoading = true
  private listeDevises: any[] = []
  private typesPaiementOptions = {}
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0

  private fallbackUrl = { path: '/' }

  private engagementIsClosed = false

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private submitUpdateDisabled = true;

  private toEdit = false;
  private nextEtatActionText = "Imputer l'engagement";
  private isNextEtatAction = true

  private deviseLoading: boolean = false
  private deviseOptions: string[] = []

  /** Variables for buttons rendering */
  private permissions : any[] = []
  private permissionCodes = {}
  private engagement = {
    id: null,
    code: '',
    eng_date: new Date(),
    montant_ttc: 0,
    cumul_imputations: 0,
    cumul_apurements_initie_ht: 0,
    cumul_imputations_initie_ttc: 0,
    devise: 'XAF',
    saisisseur: '',
    saisisseur_name: '',
    statut: '',
    next_statut: '',
    etat: '',
    valideur_first: '',
    valideur_second: '',
    valideur_final: '',
    ligne_id: 0,
    chapitre_id: 0,
    rubrique_id: 0,
    domaine: 'Fonctionnement',
    documents: [],
    imputations: []
  }

  private pickerOptions = {
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

  /** Variables for Imputation dialog form */
  private imputerFormVisible = false
  private imputerFormLoading = false
  private submitImputerDisabled = true
  private tvaImputerMismatch = false

  private imputation = {
    engagement_id: '',
    reference: '',
    montant_ttc: 0,
    devise: 'XAF',
    observations: '',
    statut: '',
    files: []
  }

  created() {
    const id = this.$route.params && this.$route.params.id
    this.permissions = UserModule.permissions
    this.permissionCodes = PermissionModule.permissionCodes
    this.fetchData(parseInt(id))
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

  private maxMontant() {
    return this.engagement.montant_ttc - this.engagement.cumul_imputations
  }

  private selectedLigne() {
    return this.cascade
  }

  private maxMontantEngagement() {
    return 0 < +this.soldeLigne ? +this.soldeLigne : 0
  }

  private async fetchData(engagementId: number) {
    this.cardLoading = true
    detailEngagement({ id: engagementId }).then((response) => {
      let { eng_date, ...eng } = response.data
      this.engagement = {eng_date: new Date(eng_date), ...eng}
      let devises = AppModule.devises
      this.listeDevises = Object.keys(AppModule.devises).map(key => {return AppModule.devises[key];})
      this.typesPaiementOptions = AppModule.typesPaiement
      this.typeOptions = AppModule.typesEngagement
      this.natureOptions = AppModule.naturesEngagement
      this.etatOptions = AppModule.etatsEngagement
      this.statutOptions = AppModule.statutsEngagement
      this.tva = AppModule.tva

      this.updateViewVariables()

      /** Initialize cascader */
      this.cascade = [this.engagement.chapitre_id, this.engagement.rubrique_id, this.engagement.ligne_id]
      this.domain = this.engagement.domaine
      this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]

      getSoldeLigne({id: this.engagement.ligne_id}).then((response) => {
        this.soldeLigne = response.data.solde_restant == 0 ? 'Solde nul' : response.data.solde_restant
      })

      this.cardLoading = false
    })
      .catch(error => {
        console.error('Error while obtaining engagement details ', error)
      })
  }

  /** Ligne budgetaire selector */
  private domainChange() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private cascadeChange() {
    console.log(this.cascade)
    this.formAttributeChange()
    this.engagement.ligne_id = this.cascade === null ? 0 : this.cascade[2]
    this.engagement.rubrique_id = this.cascade === null ? 0 : this.cascade[1]
    this.engagement.chapitre_id = this.cascade === null ? 0 : this.cascade[0]
    getSoldeLigne({id: this.engagement.ligne_id}).then((response) => {
      this.soldeLigne = response.data.solde_restant == 0 ? 'Solde nul' : response.data.solde_restant
    })
    this.updateViewVariables()
  }

  /** Imputation card utilities */
  private engagementChanged(newEngagement: any) {
    this.engagement = newEngagement
  }

  /** footer button utitlities functions */
  private loadHandler(event:any) {
    // this.cardLoading = event
  }

  private async fbcommentaireSubmit(id: number, comment:string) {
    const response = await addComment({ id: id, comment: comment })
    this.updateViewVariables()
    return response
  }

  private async fbclosePreeng(id: number, comment: string, reason: string) {
    this.cardLoading = true
    console.log("cloturer engagement")
    const response = await closePreeng({ id: id, comment: comment, reason: reason })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private async fbRestorePreeng(id: number, comment: string) {
    this.cardLoading = true
    const response = await restorePreeng({ id: id, comment: comment })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private async updateSubmit() {
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if(valid) {
        this.cardLoading = true
        let { eng_date, ...eng } = this.engagement
        updateEngagement({eng_date: new Date(eng_date).toISOString().slice(0, 19).replace('T', ' '), ...eng}).then((response) => {
          let { eng_date, ...eng } = response.data
          this.engagement = {eng_date: new Date(eng_date), ...eng}
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
        let { eng_date, ...eng } = this.engagement
        resendUpdateEngagement({eng_date: new Date(eng_date).toISOString().slice(0, 19).replace('T', ' '), ...eng}).then((response) => {
          let { eng_date, ...eng } = response.data
          this.engagement = {eng_date: new Date(eng_date), ...eng}
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
    this.engagement = response.data
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
    validationPreeng({ id: this.engagement.id, statut: statut }).then((response) => {
      this.engagement = response.data
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error validationsPreeng', error)
    })
  }

  private async fbcancelValiderSubmit(id:number, comment:string, statut:string) {
    this.cardLoading = true
    const response = await cancelValidationPreeng({ id: id, comment: comment, statut: statut })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private launchImputer() {
    this.imputation.montant_ttc = this.engagement.montant_ttc
    this.imputation.devise = this.engagement.devise
    this.imputerFormVisible = true
  }

  private resetImputerForm() {
    this.imputation = {
      engagement_id: '',
      reference: '',
      montant_ttc: 0,
      devise: 'XAF',
      observations: '',
      statut: '',
      files: []
    }
  }

  private imputerEngagement() {
    (this.$refs.imputationForm as ElForm).validate(async(valid: boolean) => {
      if(valid) {
        console.log('Imputation de lengagement avec fichiers ' + this.imputation.files)
        this.imputerFormLoading = true
        this.imputation.engagement_id = this.engagement.code
        imputerEngagement(this.imputation).then((response:any) => {
          this.engagement = response.data
          this.updateViewVariables()
          this.imputerFormLoading = false
          this.imputerFormVisible = false
          this.resetImputerForm()
        }).catch(error => {
          this.imputerFormLoading = false
          this.imputerFormVisible = false
          console.log('Erreur lors de l\' imputation de l\'engagement ', error)
        })
        // TODO : handle file upload
        this.updateViewVariables()
      } else {
        return false
      }
    })
  }

  private optionsAnnulerValider() {
    console.log('optionsAnnulerValider')
    this.updateViewVariables()
  }

  private onCancel() {
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/')
  }

  private formAttributeChange() {
    this.submitUpdateDisabled = false
  }

  private changeImputerFile(file: any, fileList: any) {
    console.log('changeImputerFile ', file, fileList, this.imputation.files)
    // this.fileList = fileList.slice(-3);
  }

  private handleRemove(file: any, fileList: any) {
    console.log('handleRemove ', file, fileList)
  }

  private handlePreview(file: any) {
    console.log('handlePreview ', file)
  }

  private imputerFormAttributeChange() {
    this.submitImputerDisabled = false
  }

  private hasPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length > 0
  }

  private hasnotPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length === 0
  }

  private engagementHasBeenValidatePOrMore() {
    return this.engagement.valideur_first || this.engagement.valideur_second || this.engagement.valideur_final
  }

  private updateViewVariables() {
    this.isCurrentUserSaisisseur = UserModule.matricule === this.engagement.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule === this.engagement.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule === this.engagement.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule === this.engagement.valideur_final

    this.nextEtatActionText = this.engagement.cumul_imputations_initie_ttc > 0 ? 'Nouvelle imputation' : "Imputer l'engagement"
    if (this.engagement.cumul_imputations < this.engagement.montant_ttc) {
      this.isNextEtatAction = true
    } else {
      this.isNextEtatAction = false
    }

    // The engagement is closed
    this.engagementIsClosed = this.engagement.etat === AppModule.etatsEngagement.CLOT.code

    /** Check if the engagement is editable or not */
    if (this.isCurrentUserSaisisseur &&
      (!this.engagementHasBeenValidatePOrMore() || this.engagement.next_statut != null)) {
      this.toEdit = true
    }
  }
}

</script>

<style lang="scss" scoped>
.el-container{
  box-shadow: 2px;
}

.cascade-extra-lg{
  width: 48.5vw;
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
