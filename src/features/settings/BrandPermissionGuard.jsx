import { Navigate, useParams } from 'react-router-dom'
import useBrandStore from '@stores/brandStore'

const BrandPermissionGuard = ({ children }) => {
  const { brandId } = useParams()
  const selectedBrand = useBrandStore((s) => s.selectedBrand)
  const canManageBrand = useBrandStore((s) => s.canManageBrand)
  const brandName = brandId && brandId !== 'default' ? decodeURIComponent(brandId) : selectedBrand

  if (!canManageBrand(brandName)) {
    return <Navigate to={`/workspace/${encodeURIComponent(brandId || 'default')}/settings/brand-info`} replace />
  }
  return children
}

export default BrandPermissionGuard
