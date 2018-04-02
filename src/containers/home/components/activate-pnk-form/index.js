import { form } from '../../../../utils/form-generator'
import { required, number } from '../../../../utils/validation'

export const {
  Form: ActivatePNKForm,
  isInvalid: getActivatePNKFormIsInvalid,
  submit: submitActivatePNKForm
} = form('activatePNKForm', {
  amount: {
    type: 'text',
    validate: [required, number],
    props: {
      type: 'number',
      className: 'Form-fullWidth'
    }
  }
})
