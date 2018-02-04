import store from '../' // eslint-disable-line unicorn/import-index
import FormHeader from '../components/form-header'
import FormInfo from '../components/form-info'
import TextInput from '../components/text-input'

import createFormGenerator from './create-form-generator'

export const { form, wizardForm } = createFormGenerator(
  { header: FormHeader, info: FormInfo, text: TextInput, number: TextInput },
  store
)
