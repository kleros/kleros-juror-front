import React from 'react'
import { storiesOf } from '@storybook/react'

storiesOf('Typography', module)
  .add('headings', () => (
    <div>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
    </div>
  ))
  .add('paragraphs', () => (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        sapien nunc, eleifend et sem nec, iaculis tincidunt felis. In urna diam,
        scelerisque sed lectus nec, viverra fermentum risus. Fusce sagittis est
        turpis, et porta urna tristique vitae. In in porta augue. Integer quis
        velit non diam sagittis elementum. Mauris luctus ante iaculis cursus
        varius.
      </p>
      <p>
        Duis sed eros ut lacus maximus sodales id ut nibh. Class aptent taciti
        sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        Phasellus accumsan convallis laoreet.
      </p>
      <p>
        Duis et mauris vestibulum, auctor lacus porttitor, pellentesque arcu.
        Sed scelerisque dolor in orci luctus semper. Mauris turpis magna, congue
        vitae sollicitudin vel, pretium nec arcu.
      </p>
      <p>
        Proin sed nunc sit amet nunc elementum facilisis sed ut justo. Interdum
        et malesuada fames ac ante ipsum primis in faucibus. Donec porttitor
        nisl sit amet metus fermentum, id finibus ipsum sollicitudin. Proin vel
        elementum sapien.
      </p>
      <p>
        In et dictum diam. Integer id orci urna. Cras facilisis lacinia
        sagittis. Nullam vel nisi at leo euismod feugiat. Mauris id iaculis
        enim. Nulla facilisi.
      </p>
    </div>
  ))
