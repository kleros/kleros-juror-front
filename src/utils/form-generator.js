import createReduxForm from 'create-redux-form'

import FormHeader from '../components/form-header'
import FormInfo from '../components/form-info'
import TextInput from '../components/text-input'

export const { form, wizardForm } = createReduxForm({
  header: FormHeader,
  info: FormInfo,
  text: TextInput
})
