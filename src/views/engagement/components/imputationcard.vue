<template>
  <div class="app-container max-w-600 center">
    <el-card shadow="always">
      <el-container>
        <el-header>
          <h1 align="center">
            Imputation {{ imputation.id }} de l'engagement {{ engagement.id }}
          </h1>
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
                      v-model="engagement.devise"
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
                    v-model="engagement.montant_ht"
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
                    v-if="isbtnUpdate || isResendUpdate"
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
                  <el-input
                    v-else
                    v-model="engagement.type_libelle"
                    :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
                  />
                </el-col>
                <el-col
                  :span="10"
                  :offset="1"
                >
                  <el-input
                    v-model="engagement.statut_libelle"
                    :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
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
                    v-if="isbtnUpdate || isResendUpdate"
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
                  <el-input
                    v-else
                    v-model="engagement.nature_libelle"
                    :disabled="!cardActive || (!isbtnUpdate && !isResendUpdate)"
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
            type="INIT"
            :submit-disabled="submitDisabled"
            :fallback-url="fallbackUrl"
            :on-cancel="onCancel"
            :update-submit="updateSubmit"
            :resend-update="resendUpdate"
            :validerp-submit="validerpSubmit"
            :validers-submit="validersSubmit"
            :validerf-submit="validerfSubmit"
            :restore-preeng="fbRestorePreeng"
            :options-annuler-valider="optionsAnnulerValider"
            :commentaire-submit="fbcommentaireSubmit"
            :close-preeng="fbclosePreeng"
            :send-back-submit="fbsendBackSubmit"
            :cancel-valider-submit="fbcancelValiderSubmit"
            :next-etat-action="launchImputer"
            @footerload="loadHandler($event)"
          />
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'ImputationCard',
  components: {
  }
})

export default class ImputationCard extends Vue {
  @Prop({ required: true }) private engagement!: any
  @Prop({ required: true }) private imputation!: any

  private cardLoading = false
  private cardActive = false
  private isbtnUpdate = false
  private isResendUpdate = false
  private submitDisabled = true

  created() {
    this.cardLoading = true
    this.updateViewVariables()
    this.cardLoading = false
  }

  private updateViewVariables() {
    // If the engagement is closed then the card should be inactive
    this.cardActive = !(this.engagement.etat === AppModule.etatsEngagement.CLOT.code)
  }

  private formAttributeChange() {
    this.submitDisabled = false
  }
}
</script>
