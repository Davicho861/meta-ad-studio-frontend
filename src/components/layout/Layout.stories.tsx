import type { Meta, Story } from '@storybook/react'
import Layout from './Layout'

export default {
  title: 'Layout/Layout',
  component: Layout,
} as Meta

const Template: Story = (args) => (
  <Layout {...args}>
    <div style={{ padding: 24 }}>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="mt-2 text-gray-600">Contenido de ejemplo dentro del layout principal.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Tarjeta 1</div>
        <div className="p-4 bg-white rounded shadow">Tarjeta 2</div>
        <div className="p-4 bg-white rounded shadow">Tarjeta 3</div>
      </div>
    </div>
  </Layout>
)

export const Default = Template.bind({})
Default.args = {}
