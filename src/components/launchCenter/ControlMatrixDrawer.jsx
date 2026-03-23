import { CheckCircle, Shield, Unlock } from 'lucide-react'
import DrawerShell from './DrawerShell'
import { CONTROL_MATRIX, CONTROL_DETAILS } from './mockData'

const detailIcons = { Shield, CheckCircle, Unlock }

const ControlMatrixDrawer = ({ isOpen, onClose }) => {
  return (
    <DrawerShell
      isOpen={isOpen}
      onClose={onClose}
      title="Control & Permissions"
      subtitle="How responsibilities are shared between you and AI"
      guideModule="controlMatrix"
    >
      <div className="space-y-6">
        {/* Matrix Table */}
        <div className="rounded-2xl overflow-hidden border border-[#F0F0F0]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Action</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-900 w-16">You</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-900 w-16">AI</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-900 w-16">Shared</th>
              </tr>
            </thead>
            <tbody>
              {CONTROL_MATRIX.map((row, i) => (
                <tr key={i} className="border-t border-[#F5F5F5] hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{row.action}</span>
                    <p className="text-[10px] text-gray-500 mt-0.5 hidden group-hover:block">{row.desc}</p>
                  </td>
                  <td className="text-center px-3 py-3">
                    {row.you && <CheckCircle className="w-4 h-4 text-primary-500 mx-auto" />}
                  </td>
                  <td className="text-center px-3 py-3">
                    {row.ai && <CheckCircle className="w-4 h-4 text-success-500 mx-auto" />}
                  </td>
                  <td className="text-center px-3 py-3">
                    {row.shared && <CheckCircle className="w-4 h-4 text-blue-500 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Cards */}
        <div className="space-y-3">
          {CONTROL_DETAILS.map((detail, i) => {
            const Icon = detailIcons[detail.icon] || Shield
            return (
              <div key={i} className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-semibold text-gray-900">{detail.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {detail.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-300 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </DrawerShell>
  )
}

export default ControlMatrixDrawer
