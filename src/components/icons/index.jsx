import React from 'react'

const makeIcon = (symbol) => ({ className, ...props }) => (
  <span aria-hidden="true" className={className} {...props}>
    {symbol}
  </span>
)

export const LayoutDashboard = makeIcon('▦')
export const Package = makeIcon('📦')
export const Tags = makeIcon('🏷️')
export const Layers = makeIcon('📚')
export const ShoppingCart = makeIcon('🛒')
export const BarChart3 = makeIcon('📊')
export const Settings = makeIcon('⚙️')
export const ChevronLeft = makeIcon('◀')
export const ChevronRight = makeIcon('▶')
export const Boxes = makeIcon('▣')
export const AlertTriangle = makeIcon('⚠️')
export const XCircle = makeIcon('✖️')
export const DollarSign = makeIcon('$')
export const TrendingUp = makeIcon('📈')
export const TrendingDown = makeIcon('📉')
export const ArrowUpRight = makeIcon('↗')
export const Clock = makeIcon('🕒')
export const Search = makeIcon('🔍')
export const ChevronDown = makeIcon('▾')
export const Plus = makeIcon('+')
export const Minus = makeIcon('−')
export const RefreshCw = makeIcon('🔄')
export const Filter = makeIcon('⚗️')
export const Edit2 = makeIcon('✎')
export const Trash2 = makeIcon('🗑️')
export const Construction = makeIcon('🚧')
export const Eye = makeIcon('👁️')
export const CheckCircle = makeIcon('✅')
export const Tag = makeIcon('🏷️')
export const MoreVertical = makeIcon('⋮')
export const Bell = makeIcon('🔔')
export const Menu = makeIcon('≡')

export const User = makeIcon('👤')
export const Shield = makeIcon('🛡️')
export const Palette = makeIcon('🎨')
export const Globe = makeIcon('🌐')
export const Database = makeIcon('🗄️')
export const Save = makeIcon('💾')
export const EyeOff = makeIcon('🙈')
export const Check = makeIcon('✔️')
export const Moon = makeIcon('🌙')
export const Sun = makeIcon('☀️')
export const Monitor = makeIcon('🖥️')

export default null
