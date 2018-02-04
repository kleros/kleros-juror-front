import { form } from '../../../../utils/form-generator'

export const {
  Form: PassPeriodForm,
  isInvalid: getPassPeriodFormIsInvalid,
  submit: submitPassPeriodForm
} = form('passPeriodForm', {
  header: {
    type: 'header',
    props: { title: 'MOVE TO NEXT PERIOD' }
  },
  currentPeriod: {
    type: 'info'
  },
  currentSession: {
    type: 'info'
  }
})
