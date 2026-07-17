import { Navigate } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'

const PlatformAdminGuard = ({ children }) => {
  const canManage = useBrandStore((state) => state.canManageIndustrySkills)()
  const brand = useBrandStore((state) => state.selectedBrand)
  if (!canManage) return <Navigate to={`/workspace/${encodeURIComponent(brand || 'default')}/chat`} replace />
  return children
}

export default PlatformAdminGuard
