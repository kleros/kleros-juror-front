import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import NotificationCard from '../src/components/notification-card'

storiesOf('Notification Card', module)
  .add('default', () => (
    <NotificationCard
      message="This is a notification card."
      onClick={action('onClick')}
      onDismissClick={action('onDismissClick')}
    />
  ))
  .add('with lots of text', () => (
    <NotificationCard
      message="This is a notification card. This is a notification card. This is a notification card. This is a notification card. This is a notification card."
      onClick={action('onClick')}
      onDismissClick={action('onDismissClick')}
    />
  ))
